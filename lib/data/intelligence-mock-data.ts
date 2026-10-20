import type {
  CohortBenchmarkItem,
  ContentSplitItem,
  CreatorVoiceVoteItem,
  EvidenceOpportunity,
  ExperimentHypothesis,
  MetricCardData,
  RetentionDataPoint,
  RoadmapCardItem,
  ShippingCommitItem,
} from "@/lib/types/creator-intelligence";

export const CHANNEL_PROFILE = {
  name: "The Minimalist Studio",
  handle: "@minimaliststudio",
  ownerName: "Nate Chen",
  subscribers: "420,000 Subscribers",
  subscribersRaw: 420000,
  lastIngested: "Last Ingested: 50 uploads",
  niche: "Tech & Studio Craft",
  status: "Continuous Ingestion Active · 12m ago",
  computeUsed: 8420,
  computeLimit: 10000,
  version: "v2.4.0",
};

export const KPI_METRIC_CARDS: MetricCardData[] = [
  {
    id: "velocity",
    title: "MEDIAN 72H VIEW VELOCITY",
    value: "41,850",
    deltaLabel: "+28.4% vs Niche Baseline: 32,240",
    deltaType: "positive",
    iconName: "trending-up",
  },
  {
    id: "hook_hold",
    title: "0-3S HOOK HOLD RATE",
    value: "74.2%",
    deltaLabel: "+13.4%",
    deltaType: "positive",
    benchmarkNote: "Benchmark: 81.8% · Problem-First leads",
    iconName: "clock",
    badgeText: "+13.4%",
    badgeVariant: "green",
  },
  {
    id: "ratio",
    title: "VIEWS / SUBSCRIBER RATIO",
    value: "9.96%",
    deltaLabel: "High Tier Cohort",
    deltaType: "neutral",
    benchmarkNote: "Top 15% cohort benchmark",
    iconName: "activity",
    badgeText: "Top 15% cohort",
    badgeVariant: "brand",
    progressPct: 84,
  },
  {
    id: "confidence",
    title: "BASELINE CONFIDENCE",
    value: "96.8 / 100",
    deltaLabel: "Calibrated",
    deltaType: "positive",
    benchmarkNote: "52 Verified Historical Uploads",
    iconName: "shield",
    badgeText: "Calibrated",
    badgeVariant: "brand",
  },
];

export const RETENTION_CURVE_DATA: RetentionDataPoint[] = [
  { timeSec: 0, timeLabel: "0:00 (Hook)", problemFirstHold: 100, narrativeArcHold: 100, curiosityGapHold: 100 },
  { timeSec: 3, timeLabel: "0:03 (Threshold)", problemFirstHold: 74.2, narrativeArcHold: 63.1, curiosityGapHold: 49.4, isThreshold: true },
  { timeSec: 15, timeLabel: "0:15", problemFirstHold: 68.5, narrativeArcHold: 56.4, curiosityGapHold: 41.2 },
  { timeSec: 30, timeLabel: "0:30", problemFirstHold: 64.1, narrativeArcHold: 52.8, curiosityGapHold: 36.8 },
  { timeSec: 45, timeLabel: "0:45", problemFirstHold: 61.2, narrativeArcHold: 49.3, curiosityGapHold: 33.5 },
  { timeSec: 60, timeLabel: "1:00 (Sustained)", problemFirstHold: 58.7, narrativeArcHold: 46.1, curiosityGapHold: 30.2 },
];

export const EVIDENCE_OPPORTUNITIES: EvidenceOpportunity[] = [
  {
    id: "pacing-042",
    numberBadge: "#1",
    title: "Pacing Bottleneck at 0:42s",
    badgeLabel: "25% Drop-off",
    badgeColor: "red",
    actionLabel: "Inspect 6 Clips",
    description:
      "Viewers churn rapidly when transitioning from topic premise into equipment b-roll without a clear verbal road sign.",
    prescription:
      "Prescription: Insert kinetic text prompt or tactile mechanical cut before 0:45s.",
    category: "pacing",
  },
  {
    id: "curiosity-underperform",
    numberBadge: "#2",
    title: "Curiosity Hook Underperformance",
    actionLabel: "Compare Scripts",
    description:
      "Videos beginning with broad rhetorical questions ('Ever wonder why your desk feels cluttered?'), lose retention twice as fast as problem statements.",
    prescription:
      "Prescription: Standardize on Problem-First opener: 'I Wasted $800 on cable management so you don't.'",
    category: "hook",
  },
  {
    id: "optimal-duration",
    numberBadge: "#3",
    title: "Optimal Video Duration Window",
    badgeLabel: "9.4m to 12.8m window",
    badgeColor: "neutral",
    actionLabel: "View Runtime Data",
    description:
      "Videos between 11:00 and 14:00 minutes hit optimal YouTube recommendation velocity with 66% average percentage viewed (APV).",
    prescription:
      "Prescription: Trim B-roll sequences longer than 12s on edits exceeding 15 minutes.",
    category: "duration",
  },
];

export const CONTENT_SPLIT_ITEMS: ContentSplitItem[] = [
  {
    id: "split-top",
    type: "top_decile",
    badgeLabel: "Top Decile (>95%)",
    title: "The $2,000 Minimalist Desk...",
    viewsFormatted: "98.4K Views",
    hookHoldRate: "82.4% 0-3s Hold",
    hookTags: ["Problem-First", "B-roll Stinger < 2s", "Desk Tension"],
    thumbnailGradient: "from-stone-800 to-amber-950",
    videoDuration: "12:44",
  },
  {
    id: "split-under",
    type: "underperformed",
    badgeLabel: "Underperformed (<15%)",
    title: "My Daily Productivity Stack 2026",
    viewsFormatted: "19.2K views",
    hookHoldRate: "51.1% 0-3s Hold",
    hookTags: ["Curiosity Rhetorical", "Talking Head > 6s", "No Proof Hook"],
    thumbnailGradient: "from-zinc-800 to-slate-900",
    videoDuration: "16:18",
  },
];

export const EXPERIMENT_HYPOTHESES: ExperimentHypothesis[] = [
  {
    id: "hyp-1",
    hypothesisNumber: 1,
    title: "Cold-open with the failure outcome instead of a talking greeting.",
    confidencePct: 92,
    predictedLift: "Predicted Lift: +13-24% Hook Hold",
    sampleSizeNote: "N=3 uploads",
    status: "active",
  },
  {
    id: "hyp-2",
    hypothesisNumber: 2,
    title: "Cut intro runtime from 14s to 4s with split-screen tactile demo.",
    confidencePct: 88,
    predictedLift: "Predicted Lift: +11% Watch Time",
    sampleSizeNote: "N=2 uploads",
    status: "active",
  },
  {
    id: "hyp-3",
    hypothesisNumber: 3,
    title: "Replace generic end-CTA with mid-roll increase tease at 07:30.",
    confidencePct: 78,
    predictedLift: "Predicted Lift: +2.1x Click-through",
    sampleSizeNote: "N=4 uploads",
    status: "active",
  },
];

export const COHORT_BENCHMARKS: CohortBenchmarkItem[] = [
  {
    id: "bench-views",
    metricName: "Median Views (72h)",
    percentileLabel: "Top 22% of cohort",
    creatorValue: "30.2K",
    cohortValue: "24.8K",
    progressPct: 78,
    note: "Creator Median: 30.2K vs Cohort Median: 24.8K",
  },
  {
    id: "bench-hook",
    metricName: "0-3s Hook Retention",
    percentileLabel: "Top 8% of cohort",
    creatorValue: "81.8%",
    cohortValue: "74.2%",
    progressPct: 92,
    note: "Creator Median: 81.8% vs Cohort Median: 74.2%",
  },
  {
    id: "bench-frequency",
    metricName: "Upload Frequency",
    percentileLabel: "Current Avg: 1.4 / wk",
    creatorValue: "1.4 / wk",
    cohortValue: "1.2 / wk",
    progressPct: 65,
    note: "Paced at 1.2 / wk vs Optimal Health Score",
  },
];

export const ROADMAP_ITEMS: RoadmapCardItem[] = [
  // Column 1: Now Shipping
  {
    id: "rm-1",
    column: "shipping",
    horizon: "mvp",
    title: "50-Post Ingestion Engine & Baseline",
    description:
      "YouTube Data API v3 integration with read-only OAuth scopes. Calculates 30-day velocity metrics and baseline engagement thresholds.",
    statusBadge: "SHIPPED · V0.9",
    statusBadgeVariant: "neutral",
    progressPct: 100,
    progressLabel: "Overall OAuth 100% Complete",
    footerTag: "Overall OAuth",
  },
  {
    id: "rm-2",
    column: "shipping",
    horizon: "mvp",
    title: "0-3s Hook Retention Classifier",
    description:
      "Automatic Whisper transcription mapped against opening drop-off curves. Classifies pacing type (Narrative, Statement, Action Hook).",
    statusBadge: "SHIPPED · V0.9.2",
    statusBadgeVariant: "neutral",
    progressPct: 100,
    progressLabel: "Audio + Curve 100% Complete",
    footerTag: "Audio + Curve",
  },
  {
    id: "rm-3",
    column: "shipping",
    horizon: "mvp",
    title: "Peer Cohort Benchmarking",
    description:
      "Anonymized cohort benchmarking across 40 creators within matched subscriber count (+15%) and content genre categories.",
    statusBadge: "FINAL STAGING",
    statusBadgeVariant: "brand",
    progressPct: 92,
    progressLabel: "Staging Rollout 92%",
    footerTag: "Staging Rollout",
    subNote: "Private Data Beta - v0.9.5 Target",
  },

  // Column 2: Up Next · Q3
  {
    id: "rm-4",
    column: "up_next",
    horizon: "in_dev",
    title: "TikTok Creator API & Curve Analyzer",
    description:
      "Vertical video drop-off curves with trending audio sync correlation. Identifies second-by-second dropoff caused by slow video cuts.",
    statusBadge: "ACTIVE DEV",
    statusBadgeVariant: "brand",
    votes: 382,
    progressPct: 100,
    progressLabel: "Retention Curve Telemetry Ready",
    footerTag: "Retention Curve Telemetry",
    sprintMeta: "Sprint 16 / 20 · Deploy Aug 14",
  },
  {
    id: "rm-5",
    column: "up_next",
    horizon: "in_dev",
    title: "Automated Experiment Backlog Tracker",
    description:
      "Statistical testing framework logging hypothesis p-values, thumbnail variant tests, and audience retention deltas over 14 days.",
    statusBadge: "ACTIVE DEV",
    statusBadgeVariant: "brand",
    votes: 318,
    footerTag: "Regress Bayesian Prior",
    sprintMeta: "Sprint 17",
  },
  {
    id: "rm-6",
    column: "up_next",
    horizon: "in_dev",
    title: "Discord Webhooks & Velocity Signals",
    description:
      "Instant alerts fired when an upload deviates +25% from 72h baseline velocity, giving creators immediate packaging feedback.",
    statusBadge: "DESIGN SPEC",
    statusBadgeVariant: "purple",
    votes: 189,
    footerTag: "Integrations · v1 Spec Complete",
  },

  // Column 3: Planned · Q4
  {
    id: "rm-7",
    column: "planned",
    horizon: "q4_planned",
    title: "Thumbnail Heatmap & Visual Salience",
    description:
      "Non-generative visual hierarchy scoring, mobile crop previews, and contrast analysis against top YouTube search competitors.",
    statusBadge: "RESEARCH",
    statusBadgeVariant: "amber",
    votes: 670,
    footerTag: "Computer Vision · Q4 Inception",
  },
  {
    id: "rm-8",
    column: "planned",
    horizon: "q4_planned",
    title: "Script Pacing & Narrative Deconstruction",
    description:
      "Detects narrative dip zones (specifically between 2:00 and 4:00 minutes) and correlates speech cadence to retention drop points.",
    statusBadge: "SCOPING",
    statusBadgeVariant: "neutral",
    votes: 422,
    footerTag: "NLP + Audio Cadence · Q1 Roadmap",
  },
  {
    id: "rm-9",
    column: "planned",
    horizon: "q4_planned",
    title: "Instagram Reels Unified Ingestion",
    description:
      "Cross-post correlation testing whether horizontal YouTube videos can be converted effectively into Instagram short-form assets.",
    statusBadge: "SCOPING",
    statusBadgeVariant: "neutral",
    votes: 295,
    footerTag: "Meta Graph API · Late Q4",
  },

  // Column 4: Future Horizons
  {
    id: "rm-10",
    column: "future",
    horizon: "future",
    title: "Sponsor Segment ROI & Audience Audit",
    description:
      "Precise retention drop estimation across mid-roll sponsor reads. Generates sponsor value certificates for media kit negotiation.",
    statusBadge: "TOP COMMUNITY IDEA",
    statusBadgeVariant: "brand",
    votes: 912,
    footerTag: "Brand Analytics · Needs 1k Votes",
  },
  {
    id: "rm-11",
    column: "future",
    horizon: "future",
    title: "Collab Matcher for Niche Cohorts",
    description:
      "Algorithms that discover non-competing creators with matched viewer overlaps to co-produce long-form breakout features.",
    statusBadge: "PROPOSAL",
    statusBadgeVariant: "green",
    votes: 567,
    footerTag: "Audience Clustering · Under Review",
  },
];

export const CREATOR_VOICE_VOTES: CreatorVoiceVoteItem[] = [
  {
    id: "cv-1",
    title: "Exportable PDF Reports for Brand Decks",
    category: "Reporting",
    description:
      "One-click serialized PDF export proving audience velocity and hook retention for pitching four-figure brand sponsorships.",
    votesCount: 940,
  },
  {
    id: "cv-2",
    title: "Automated A/B Title Synthesizer",
    category: "NLP",
    description:
      "Generates 5 alternative high-CTR title variations derived from top 1% performing videos in your exact semantic niche.",
    votesCount: 715,
  },
  {
    id: "cv-3",
    title: "Podcasting / Long-form RSS Feed Ingestion",
    category: "Audio Engine",
    description:
      "Parse Spotify and Apple Podcasts download streams to match listener dropouts against episode chapters.",
    votesCount: 482,
  },
];

export const SHIPPING_COMMITS: ShippingCommitItem[] = [
  {
    id: "com-1",
    version: "v0.9.4 · Yesterday",
    commitHash: "#8121c",
    description:
      "Fixes YouTube Shorts view velocity calculation & improved hook confidence scoring to 98%.",
    highlightTag: "Applied to all 50-post histories",
    tagColor: "green",
  },
  {
    id: "com-2",
    version: "v0.9.3 · 4 days ago",
    commitHash: "#3d90e",
    description:
      "Whisper transcription latency optimized by 4.2x using int8 quantization on AWS Inferentia.",
    highlightTag: "0.4s response on 60s hooks",
    tagColor: "brand",
  },
  {
    id: "com-3",
    version: "v0.9.1 · 8 days ago",
    commitHash: "#ee110c",
    description:
      "Introduced non-linear cohort outlier suppression for viral views smoothing.",
    highlightTag: "Median IQR normalization live",
    tagColor: "purple",
  },
];
