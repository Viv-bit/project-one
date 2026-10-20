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
  relativeTime: string;
  commitHash: string;
  description: string;
  highlightTag: string;
  tagColor?: "green" | "brand" | "purple";
};
