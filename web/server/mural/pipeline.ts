import type Anthropic from "@anthropic-ai/sdk";
import { analyzeReferences } from "./analyzeRefs.js";
import { buildBrief, validateComposeRequest } from "./buildBrief.js";
import { generateMuralImages } from "./generateImage.js";
import {
  appendAssets,
  createJob,
  getJob,
  setBrief,
  setJobStatus,
  updateJob,
} from "./jobs.js";
import { writeJobAsset, writeJobManifest } from "./storage.js";
import type {
  MuralBrief,
  MuralComposeRequest,
  MuralGeneratedAsset,
  MuralJob,
  ReferenceAnalysis,
} from "./types.js";

function extForMime(mime: string): string {
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  return "png";
}

export async function runAnalyzePipeline(
  anthropic: Anthropic,
  request: MuralComposeRequest
): Promise<{ brief: MuralBrief; analyses: ReferenceAnalysis[] }> {
  const err = validateComposeRequest(request);
  if (err) throw new Error(err);

  const analyses = await analyzeReferences(anthropic, request);
  const brief = buildBrief(request, analyses);
  return { brief, analyses };
}

export async function runComposePipeline(
  anthropic: Anthropic,
  request: MuralComposeRequest,
  existingJobId?: string
): Promise<MuralJob> {
  const err = validateComposeRequest(request);
  if (err) throw new Error(err);

  const job = existingJobId ? getJob(existingJobId) : createJob();
  if (!job) throw new Error("Job não encontrado");
  const jobId = job.id;

  try {
    setJobStatus(jobId, "analyzing");
    const analyses = await analyzeReferences(anthropic, request);
    setJobStatus(jobId, "briefing");
    let brief = buildBrief(request, analyses);
    setBrief(jobId, brief);

    const variants = Math.min(
      Math.max(request.options?.variants ?? 1, 1),
      4
    );

    setJobStatus(jobId, "generating");
    let images = await generateMuralImages(
      brief,
      request.references,
      variants
    );

    setJobStatus(jobId, "curating");
    let attempt = 0;
    while (images.length === 0 && attempt < 2) {
      attempt += 1;
      brief = {
        ...brief,
        generationPrompt: `${brief.generationPrompt} Refine: maior fidelidade à identidade e cena.`,
      };
      setBrief(jobId, brief);
      images = await generateMuralImages(
        brief,
        request.references,
        variants
      );
    }

    if (images.length === 0) {
      throw new Error("Nenhuma imagem gerada após tentativas");
    }

    const assets: MuralGeneratedAsset[] = [];
    for (let i = 0; i < images.length; i++) {
      const { buffer, mimeType } = images[i];
      const ext = extForMime(mimeType);
      const filename = `variant-${i + 1}.${ext}`;
      writeJobAsset(jobId, filename, buffer);
      assets.push({
        filename,
        url: `/api/mural/jobs/${jobId}/assets/${filename}`,
        variantIndex: i,
      });
    }

    appendAssets(jobId, assets);
    const manifestPath = writeJobManifest(jobId, {
      jobId,
      prompt: request.prompt,
      brief,
      assets,
      completedAt: new Date().toISOString(),
    });

    updateJob(jobId, {
      status: "completed",
      manifestPath,
      assets: getJob(jobId)?.assets ?? assets,
    });

    const final = getJob(jobId);
    if (!final) throw new Error("Job perdido após conclusão");
    return final;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    updateJob(jobId, { status: "failed", error: message });
    throw e;
  }
}

export async function runComposeAsync(
  anthropic: Anthropic,
  request: MuralComposeRequest
): Promise<MuralJob> {
  const job = createJob();
  void runComposePipeline(anthropic, request, job.id).catch(() => {
    /* errors stored on job */
  });
  return job;
}
