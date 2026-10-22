export type MetricTrend = "positive" | "negative" | "neutral";

export type MetricCardData = {
  id: string;
  title: string;
  value: string;
  unit?: string;
  deltaLabel: string;
  deltaType: MetricTrend;
  benchmarkNote?: string;
  iconName:
    | "activity"
    | "zap"
    | "shield"
    | "trending-up"
    | "trending-down"
    | "clock"
    | "users";
  badgeText?: string;
  badgeVariant?: "neutral" | "brand" | "green" | "purple";
  progressPct?: number;
};

export type RetentionFormat = "all" | "longform" | "shorts";

export type RetentionDataPoint = {
  timeSec: number;
  timeLabel: string;
  problemFirstHold: number;
  narrativeArcHold: number;
  curiosityGapHold: number;
  isThreshold?: boolean;
};

export type EvidenceOpportunity = {
  id: string;
  numberBadge: "#1" | "#2" | "#3";
  title: string;
  badgeLabel?: string;
  badgeColor?: "red" | "orange" | "neutral";
  actionLabel: string;
  description: string;
  prescription: string;
  category: "pacing" | "hook" | "duration";
};

export type ContentSplitItem = {
  id: string;
  type: "top_decile" | "underperformed";
  badgeLabel: string;
  title: string;
  viewsFormatted: string;
  hookHoldRate: string;
  hookTags: string[];
  thumbnailGradient: string;
  videoDuration: string;
};

export type ExperimentHypothesis = {
  id: string;
  hypothesisNumber: number;
  title: string;
  confidencePct: number;
  predictedLift: string;
  sampleSizeNote: string;
  status: "active" | "pending" | "completed";
};

export type CohortBenchmarkItem = {
  id: string;
  metricName: string;
  percentileLabel: string;
  creatorValue: string;
  cohortValue: string;
  progressPct: number;
  note: string;
};

export type RoadmapHorizonFilter =
  | "all"
  | "mvp"
  | "in_dev"
  | "q4_planned"
  | "future";

export type RoadmapColumnKey = "shipping" | "up_next" | "planned" | "future";

export type RoadmapCardItem = {
  id: string;
  column: RoadmapColumnKey;
  horizon: RoadmapHorizonFilter;
  title: string;
  description: string;
  statusBadge: string;
  statusBadgeVariant: "neutral" | "brand" | "green" | "purple" | "amber";
  votes?: number;
  progressPct?: number;
  progressLabel?: string;
  metricScore?: string;
  footerTag?: string;
  sprintMeta?: string;
  subNote?: string;
};

export type CreatorVoiceVoteItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  votesCount: number;
  hasVoted?: boolean;
};

export type ShippingCommitItem = {
  id: string;
  version: string;
  relativeTime?: string;
  commitHash: string;
  description: string;
  highlightTag: string;
  tagColor?: "green" | "brand" | "purple";
};

export type IngestedVideoPost = {
  id: string;
  externalId: string;
  title: string;
  publishedAt: string;
  durationFormatted: string;
  durationSeconds: number;
  views: number;
  viewsFormatted: string;
  hookHoldPct: number;
  likes: number;
  comments: number;
  shares: number;
  viewToSubRatio: number;
  hookType: "Problem-First" | "Story Narrative" | "Curiosity Gap" | "Question Opener" | "Bold Statement";
  topicPillar: "Studio Setup" | "Desk Tech" | "Productivity Workflow" | "Audio/Video Gear" | "Creator Economy";
  ctaType: "Mid-roll Tease" | "End Screen Card" | "Verbal Direct" | "Pinned Comment";
  tone: "Minimal / Direct" | "Analytical" | "Conversational" | "Urgent";
  tier: "top_decile" | "baseline" | "underperformed";
  thumbnailGradient: string;
  transcriptHookSnippet: string;
  audioExtracted: boolean;
};

export type BenchmarkPeerCreator = {
  id: string;
  handle: string;
  displayName: string;
  subscribersFormatted: string;
  primaryHook: string;
  topTopic: string;
  similarityPct: number;
  medianViewsFormatted: string;
};

export type BenchmarkMetricDetail = {
  id: string;
  name: string;
  creatorValueFormatted: string;
  creatorRawValue: number;
  cohortMedianFormatted: string;
  cohortMedianRaw: number;
  topDecileFormatted: string;
  topDecileRaw: number;
  unit: string;
  percentileRank: number;
  deltaLabel: string;
  deltaType: "positive" | "negative" | "neutral";
  strategicTakeaway: string;
};

export type BenchmarkCohortInfo = {
  cohortTitle: string;
  cohortDescription: string;
  cohortSize: number;
  followerTier: string;
  niche: string;
  primaryLanguage: string;
  contentFormat: string;
  metrics: BenchmarkMetricDetail[];
  peers: BenchmarkPeerCreator[];
};

export type DetailedInsight = {
  id: string;
  category: "hook" | "pacing" | "duration" | "topic" | "cta";
  priority: "high" | "medium" | "experimental";
  title: string;
  observation: string;
  evidenceMetric: string;
  evidenceCreatorValue: string;
  evidenceBenchmarkValue: string;
  sampleSizeLabel: string;
  linkedPostIds: string[];
  interpretation: string;
  recommendation: string;
  confidenceScore: number;
  suggestedExperiment?: {
    hypothesis: string;
    suggestedDurationDays: number;
    targetPostCount: number;
    primaryMetric: string;
    predictedLift: string;
  };
};

export type ExperimentRecord = {
  id: string;
  experimentNumber: number;
  title: string;
  hypothesis: string;
  recommendationId?: string;
  status: "active" | "inconclusive" | "validated";
  primaryMetric: string;
  baselineValueFormatted: string;
  currentValueFormatted: string;
  liftPctFormatted: string;
  targetPostCount: number;
  currentPostCount: number;
  durationDays: number;
  daysElapsed: number;
  startDate: string;
  linkedPostIds: string[];
  notes: string;
};

export type IngestionPipelineStage = {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending" | "error";
  itemsProcessed: number;
  totalItems: number;
  details?: string;
};

