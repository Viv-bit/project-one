# Technical Design Document: AI Creator Intelligence Platform

- **Status**: Companion to PRD v1.0
- **Date**: Sep 24, 2026
- **Author**: @Fatima Jimoh
- **Architecture**: Modular Monolith

---

## 1. Architectural Strategy

The application begins as a **Modular Monolith**: a unified API deployable codebase containing strict internal domain boundaries, decoupled from async worker processes handling intensive background jobs.

```text
   +-----------------------+
   |   Next.js Frontend    |
   +-----------+-----------+
               | (REST / OpenAPI / SSE)
               v
   +-----------------------+
   |   NestJS Modular API  |
   +-----+-----------+-----+
         |           |
         v           v
+---------------+  +---------------------+
|  PostgreSQL   |  |   Redis + BullMQ    |
|  + pgvector   |  +----------+----------+
+---------------+             |
                              v
                   +---------------------+
                   | Background Workers  |
                   +----+-----------+----+
                        |           |
         +--------------+           +--------------+
         v                                         v
+------------------------+                +------------------------+
|  Social Platform APIs  |                |   External AI APIs     |
|   (OAuth, Ingest)      |                | (LLM, Embeddings, STT) |
+------------------------+                +------------------------+
```

### Core Architecture Rules

1. **Deterministic code calculates; the LLM interprets**: No math, percentiles, or metrics are computed inside LLM prompts.
2. **Strict Interface Decoupling**: All third-party social platforms and AI model providers sit behind abstract interfaces so vendors can be swapped without touching core logic.

---

## 2. Technology Stack

| Layer | Technology | Rationale / Specification |
| :--- | :--- | :--- |
| **Frontend** | Next.js, React, TypeScript | Tailwind CSS, shadcn/ui, TanStack Query, Recharts. |
| **Backend** | Node.js, TypeScript, NestJS (or Fastify) | Strongly typed modular architecture, edge validation, auto-generated OpenAPI. |
| **Database** | PostgreSQL + pgvector | Relational consistency, time-series metrics, vector indexing (`HNSW`/`IVFFlat`). |
| **Cache & Queues**| Redis + BullMQ | Job scheduling, retries, backoff, deduplication, worker task distribution. |
| **Object Storage**| Amazon S3 (or S3-compatible) | Thumbnails, extracted audio streams, frame captures. |
| **AI Providers** | External APIs | LLM (reasoning/synthesis), text embeddings, Speech-to-Text (STT), Vision. |
| **DevOps / CI** | Docker, GitHub Actions | Linting, typing, automated unit/integration tests, containerized deploys. |

---

## 3. Frontend Architecture

Organized around **domain features** rather than generic utility groupings:

```text
src/
├── components/          # Shared atomic UI primitives (buttons, dialogs, inputs)
├── features/
│   ├── auth/            # Login, registration, token refresh flows
│   ├── creator/         # Profile display, account settings
│   ├── content/         # Post lists, metric cards, post classification drawers
│   ├── benchmarks/      # Peer comparison charts, percentile bands
│   ├── insights/        # Observation cards, evidence expansion views
│   ├── recommendations/ # Prioritized opportunity lists, actionable suggestions
│   └── experiments/     # Setup wizard, experiment trackers, outcome delta charts
├── layouts/             # App shells, sidebar navigation, headers
├── pages/ / app/        # Route boundaries
├── services/            # Typed API client abstractions
├── hooks/               # Custom React hooks
├── stores/              # Client-side state management
├── types/               # Shared domain interfaces and DTOs
└── utils/               # Formatters, deterministic math helpers
```

### Primary Frontend Routes

- `/auth/login`, `/auth/register`, `/auth/forgot-password`
- `/onboarding`, `/onboarding/progress` (monitors asynchronous ingestion)
- `/dashboard/overview`
- `/dashboard/performance`
- `/dashboard/content`
- `/dashboard/benchmarks`
- `/dashboard/insights`
- `/dashboard/recommendations`
- `/dashboard/experiments`

---

## 4. Backend Domain Modules

Located in `backend/src/`:

| Module | Core Responsibility |
| :--- | :--- |
| `auth/users` | Registration, credential hashing, JWT/session issuance, refresh tokens, role/permission guards. |
| `social-accounts` | OAuth handshake, token encryption at rest, automated token refreshes, disconnect workflows. |
| `posts` | Data normalization across providers, deduplication, historical backfills, snapshot storage. |
| `analytics` | Deterministic mathematical engine: medians, percentiles, engagement ratios, decay, groupings. |
| `ai` | Provider abstraction, structured prompt templates, Zod schema validation, response caching. |
| `benchmarks` | Vector retrieval of peer candidates, peer ranking, cohort normalization, aggregate snapshots. |
| `recommendations` | Insight rule evaluation, LLM reasoning synthesis, evidence graph linking, deduplication. |
| `experiments` | Experiment lifecycle, tracking post linkage, baseline comparison, data-sufficiency guardrails. |
| `jobs` | BullMQ worker configurations, queue definitions, retry schedules, failure dead-letter queues. |

### Social Provider Abstraction

```typescript
export interface CreatorProfile {
  id: string;
  platformId: string;
  handle: string;
  displayName: string;
  followerCount: number;
  avatarUrl: string;
}

export interface Post {
  id: string;
  externalId: string;
  publishedAt: Date;
  title?: string;
  caption: string;
  mediaUrl: string;
  thumbnailUrl: string;
  durationSeconds?: number;
}

export interface PostMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves?: number;
  recordedAt: Date;
}

export interface SocialProvider {
  getProfile(): Promise<CreatorProfile>;
  getPosts(limit?: number): Promise<Post[]>;
  getPostMetrics(postIds: string[]): Promise<PostMetrics[]>;
}
```

---

## 5. Database Schema & Data Modeling

Primary entities configured in PostgreSQL:

- `users`: Core account details, credentials, billing status, timestamps.
- `social_accounts`: Linked external accounts, encrypted tokens, refresh tokens, sync timestamps.
- `creators`: Inferred creator profile metadata, primary niche, audience scale tier, computed attributes.
- `posts`: Normalized post entities linked to a `social_account_id`.
- `post_metrics`: Append-only time-series snapshots of views, likes, shares, comments.
- `post_features`: AI classification output stored as JSONB (hook category, topic, CTA style, tone).
- `transcripts`: Full Speech-to-Text outputs with word-level timestamps where supported.
- `embeddings`: pgvector representations of creator profiles, post captions, and transcripts.
- `benchmark_groups`: Groupings of comparable creator profiles.
- `benchmark_creators`: Public profile benchmarks and metadata.
- `analyses`: Analysis run records tracking job status, execution timestamps, and errors.
- `insights`: Discrete observations emitted by deterministic rules engine.
- `recommendations`: Synthesized action items linked to concrete evidence and posts.
- `experiments`: Creator-initiated tests tracking hypotheses, target post cohorts, and durations.
- `experiment_results`: Pre-experiment baseline vs. post-experiment performance computations.
- `jobs`: BullMQ state synchronization and operational health tracking.

---

## 6. API Design (Selected Endpoints)

### Authentication
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`

### Social Connections
- `GET /social-accounts`
- `POST /social-accounts/connect`
- `DELETE /social-accounts/:id`
- `POST /social-accounts/:id/sync`

### Creator Analytics & Content
- `GET /creator`
- `GET /creator/overview`
- `GET /creator/content`

### Analysis Engine
- `POST /analysis` (Triggers asynchronous ingestion and intelligence pipeline)
- `GET /analysis/:id`
- `GET /analysis/:id/status` (Polled or streamed via SSE for progress UI)

### Benchmarks, Recommendations & Experiments
- `GET /benchmarks`
- `GET /benchmarks/:id`
- `GET /recommendations`
- `GET /recommendations/:id`
- `POST /experiments`
- `GET /experiments`
- `GET /experiments/:id`
- `PATCH /experiments/:id`
- `POST /experiments/:id/results`

---

## 7. AI Pipeline & Provider Contracts

### Pipeline Stages
1. **Raw Content Ingest**: Normalized metadata persistence.
2. **Audio Extraction & STT**: Background worker extracts audio and generates cached transcript.
3. **Content Classification**: Fast, cost-efficient LLM categorizes hook, topic, intent, and CTA.
4. **Vector Embedding**: Captions, transcripts, and metadata embedded into pgvector.
5. **Deterministic Performance Run**: Median calculations, percentile ranking, outlier detection.
6. **Benchmark Matching**: Vector similarity query retrieves peer group candidates.
7. **Comparative Synthesis**: Rule engine flags discrepancies; reasoning LLM synthesizes actionable insights.
8. **Structured Validation**: Zod parses JSON output before database write.

### AI Provider Interface

```typescript
export interface PostFeatures {
  topic: string;
  pillar: string;
  hookType: string;
  ctaType: string;
  tone: string;
  intent: string;
}

export interface Evidence {
  metric: string;
  creatorValue: number | string;
  benchmarkValue?: number | string;
  sampleSize: number;
  sourcePostIds: string[]; // Must link to valid records in `posts`
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  observation: string;
  evidence: Evidence[];
  interpretation: string;
  recommendation: string;
  confidence: number;
  experiment?: {
    hypothesis: string;
    suggestedDurationDays: number;
    targetPostCount: number;
    primaryMetric: string;
  };
}

export interface AIProvider {
  classifyContent(post: Partial<Post>): Promise<PostFeatures>;
  generateEmbedding(text: string): Promise<number[]>;
  analyzeTranscript(transcriptText: string): Promise<{ summary: string; hookAnalysis: string }>;
  generateRecommendations(context: {
    creatorMetrics: Record<string, any>;
    benchmarkMetrics: Record<string, any>;
    observations: string[];
  }): Promise<Recommendation[]>;
}
```

---

## 8. Intelligence Engines

### 1. Benchmarking Engine
Computes cosine distance on creator profile embeddings combined with hard filters:
- Same platform
- Similar follower tier ($\pm 50\%$)
- Same primary language
- Compatible content formats

Generates snapshot baselines (median views, upload frequency, hook distribution).

> **Guardrail**: Peer rankings are exclusively internal for cohort assembly; never shown as public vanity leaderboards.

### 2. Insight Rules Engine (Deterministic First)
Evaluates rule predicates over database aggregates before invoking LLM:

$$\text{IF } \text{median}(\text{topic}_{\text{education}}) > 1.35 \times \text{median}(\text{all\_posts}) \implies \text{EMIT}(\text{TopicOpportunity})$$

Formulates verified `Evidence` records holding pointers to exact post IDs.

### 3. Recommendation Engine
Transforms rule outputs into human-readable recommendations via LLM reasoning. Priority assignment (`High`, `Medium`, `Experimental`) is computed deterministically from sample size and effect size—not hallucinated by the model.

### 4. Experiment Engine
Evaluates pre-experiment baseline performance against linked experimental posts.

> **Data Sufficiency Rule**: Requires reaching both minimum post count ($N \ge 3$) and time duration threshold before evaluating. If minimums are unmet, status returns `Inconclusive`.

---

## 9. Background Job Orchestration

### BullMQ Queues
- `IMPORT_CONTENT`: Pulls metadata from platform APIs.
- `PROCESS_CONTENT`: Sanitizes, normalizes, and handles post persistence.
- `TRANSCRIBE_CONTENT`: Downloads media audio and executes STT.
- `ANALYZE_CONTENT`: Executes batch LLM classifications.
- `GENERATE_EMBEDDING`: Generates vector embeddings for pgvector storage.
- `DISCOVER_BENCHMARKS`: Computes peer vector similarity and cohorts.
- `ANALYZE_BENCHMARKS`: Calculates aggregate peer performance metrics.
- `GENERATE_INSIGHTS`: Executes rule evaluations over metrics.
- `GENERATE_RECOMMENDATIONS`: Synthesizes final recommendations.
- `SYNC_METRICS`: Daily recurring cron job updating time-series snapshots.

All jobs are idempotent, keyed on `postId` or `analysisId`, and configured with exponential backoff retries.

---

## 10. Security, Privacy & Cost Governance

### Token Security
OAuth access and refresh tokens are encrypted at rest using AES-256-GCM. Tokens are never exposed to the frontend client.

### OAuth Scopes
Least-privilege access only (e.g., `youtube.readonly`). Zero write or delete scopes.

### Compliance
Uses official partner APIs only; no headless browser scraping as core functionality.

### Cost Reduction Controls
- LLM classifications run on small, fast models; larger reasoning models are reserved strictly for insight synthesis.
- Embeddings are generated once and immutable unless underlying text changes.
- Classification and token calls are batched across multiple posts.
- LLM results are permanently cached against post hashes.

### Data Deletion
Complete cascade deletion support removing all imported posts, metrics, features, and embeddings upon creator request.

---

## 11. Testing & Validation Strategy

- **Unit & Integration**: API boundary validation, ORM migrations, deterministic analytics math, and OAuth lifecycle flows.
- **AI Evaluation (Golden Dataset)**: A curated reference dataset of ~100 pre-classified posts across multiple niches. CI runs regressions measuring classification accuracy against ground truth before any prompt or model update is shipped.
- **End-to-End**: Full automated flow: $\text{Signup} \to \text{OAuth connect} \to \text{content ingestion} \to \text{intelligence pipeline run} \to \text{dashboard population} \to \text{experiment creation}$.