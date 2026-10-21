-- =============================================================================
-- APEX - vector search for the tutor/RAG (draft v0.1)
-- Requires the pgvector extension. Apply after 001_schema.sql.
-- The embedding dimension (1024) is an assumption: it must match the embedding
-- model selected in spike S-06; changing it later means re-embedding all chunks.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE ai.knowledge_chunks ADD COLUMN IF NOT EXISTS embedding vector(1024);

CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx
  ON ai.knowledge_chunks USING hnsw (embedding vector_cosine_ops);

-- Entitlement-filtered retrieval: the ACL is applied INSIDE the query, before ranking,
-- so a student can never retrieve (or be shown a citation from) a product they do not own.
-- SECURITY INVOKER keeps tenant RLS in force for the calling role.
CREATE OR REPLACE FUNCTION ai.search_chunks(
  p_user_id   uuid,
  p_query     vector(1024),
  p_limit     int DEFAULT 8,
  p_product_id uuid DEFAULT NULL      -- optional narrowing (e.g. only the current course)
) RETURNS TABLE (
  chunk_id   uuid,
  product_id uuid,
  lesson_id  uuid,
  content    text,
  t_start    int,
  t_end      int,
  distance   double precision
)
LANGUAGE sql STABLE SECURITY INVOKER AS $$
  SELECT c.id, c.product_id, c.lesson_id, c.content, c.t_start, c.t_end,
         (c.embedding <=> p_query) AS distance
    FROM ai.knowledge_chunks c
   WHERE c.embedding IS NOT NULL
     AND (p_product_id IS NULL OR c.product_id = p_product_id)
     AND (
           c.visibility = 'public'
        OR (c.visibility = 'entitled' AND EXISTS (
              SELECT 1
                FROM lms.enrollments e
               WHERE e.tenant_id  = c.tenant_id
                 AND e.user_id    = p_user_id
                 AND e.product_id = c.product_id
                 AND e.status IN ('active','completed')
                 AND (e.ends_at IS NULL OR e.ends_at > now())
           ))
         )
   ORDER BY c.embedding <=> p_query
   LIMIT LEAST(GREATEST(p_limit, 1), 50)
$$;

GRANT EXECUTE ON FUNCTION ai.search_chunks(uuid, vector, int, uuid) TO apex_app;
