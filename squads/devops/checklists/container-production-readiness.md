# Container Production Readiness Checklist

> Reviewer: container-engineer
> Purpose: Validate containers are production-ready before deployment.
> Usage: Check every item. A single unchecked CRITICAL item blocks deployment.

---

## 1. Dockerfile Quality

- [ ] Multi-stage build separates build and runtime environments
- [ ] Base image is minimal (alpine, distroless, or slim)
- [ ] Base image version is pinned (no `:latest` in production)
- [ ] RUN commands are combined to minimize layers
- [ ] .dockerignore excludes node_modules, .git, tests, docs

---

## 2. Security [CRITICAL]

- [ ] Container runs as non-root user (USER directive present)
- [ ] No secrets in Dockerfile (no ENV with credentials, no COPY of .env)
- [ ] Read-only filesystem where possible
- [ ] Image scanned with Trivy/Grype — zero CRITICAL vulnerabilities
- [ ] No unnecessary packages installed (no build tools in production stage)

---

## 3. Health & Observability

- [ ] HEALTHCHECK instruction defined in Dockerfile
- [ ] Application exposes /health endpoint
- [ ] Structured logging (JSON) to stdout/stderr
- [ ] Graceful shutdown handles SIGTERM (connection draining)

---

## 4. Resource Management

- [ ] CPU and memory limits defined in deployment manifest
- [ ] Resource reservations set to prevent OOM kills
- [ ] Container doesn't write to local filesystem (stateless)
- [ ] Volumes used only for persistent data (databases, uploads)

---

## 5. Kubernetes (if applicable)

- [ ] Liveness, readiness, and startup probes configured
- [ ] PodDisruptionBudget defined for high-availability services
- [ ] Anti-affinity rules prevent all replicas on same node
- [ ] HorizontalPodAutoscaler configured with appropriate metrics
