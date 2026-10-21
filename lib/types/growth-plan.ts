export type HorizonObjective = {
  title: string;
  targetBadge: string;
  pacingRunRate: string;
  currentSubscribers: number;
  targetSubscribers: number;
  progressPercent: number;
  channelLaunchBaseline: string;
  requiredNet: string;
};

export type AlgorithmicLever = {
  id: string;
  leverNumber: string;
  confidence: number;
  title: string;
  description: string;
  metricLiftLabel: string;
  metricLiftValue: string;
};

export type SprintChecklistItem = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  statusIcon: "checked" | "clock" | "lock" | "frame";
};

export type GrowthSprint = {
  id: string;
  sprintNumber: number;
  status: "active" | "queued" | "planned" | "horizon";
  statusBadge: string;
  weeksLabel: string;
  title: string;
  description: string;
  targetMetric: {
    label: string;
    valueFormatted: string;
    progressPct?: number;
  };
  checklistMeta: string;
  checklist?: SprintChecklistItem[];
  unlockMessage?: string;
};

export type PrescribedVideoExperiment = {
  id: string;
  episodeTag: string;
  title: string;
  hypothesis: string;
  hookCategoryTag: string;
  estVelocity: string;
  targetDuration: string;
  shootDate: string;
  thumbnailSrc: string;
};

export type CreatorPitfall = {
  id: string;
  title: string;
  metricPenalty: string;
  description: string;
  iconName: "ban" | "eye-off" | "megaphone";
};

export type StrategistReview = {
  badge: string;
  title: string;
  description: string;
  strategistName: string;
  strategistRole: string;
  strategistInitials: string;
};
