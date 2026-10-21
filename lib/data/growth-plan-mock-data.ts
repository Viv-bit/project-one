import type {
  AlgorithmicLever,
  CreatorPitfall,
  GrowthSprint,
  HorizonObjective,
  PrescribedVideoExperiment,
  StrategistReview,
} from "@/lib/types/growth-plan";

export const HORIZON_OBJECTIVE: HorizonObjective = {
  title: "Breakthrough to 750,000 Verified Subscribers",
  targetBadge: "Target: Q4 Completion",
  pacingRunRate: "Pacing +3.2k net subs/week vs +1.8k historical run-rate",
  currentSubscribers: 420000,
  targetSubscribers: 750000,
  progressPercent: 56.0,
  channelLaunchBaseline: "Channel Launch: 280k",
  requiredNet: "Required Net: +330,000",
};

export const ALGORITHMIC_LEVERS: AlgorithmicLever[] = [
  {
    id: "lever-1",
    leverNumber: "Lever #1: Retention",
    confidence: 94,
    title: "Pacing & Transition Architecture",
    description:
      "Systematic removal of 4-second still talking-head passages. Replacing static monologue with dynamic multi-angle b-roll and sensory foley sound beds.",
    metricLiftLabel: "Expected Retention Lift",
    metricLiftValue: "+22% Avg View Duration",
  },
  {
    id: "lever-2",
    leverNumber: "Lever #2: Acquisition",
    confidence: 91,
    title: "Curiosity-to-Problem Hook Pivot",
    description:
      "Abandon broad intro welcomes. Pivot immediately to high-stakes micro-failures or physical craft paradoxes within seconds 0:00–0:03.",
    metricLiftLabel: "Expected Hook Hold Lift",
    metricLiftValue: "+16% 0–3s Retention",
  },
  {
    id: "lever-3",
    leverNumber: "Lever #3: Cadence",
    confidence: 88,
    title: "Runtime & Cadence Normalization",
    description:
      "Constrain final cut duration strictly to the 11–14 min bracket. Publishing rhythm tuned to 1.4 uploads per week (Tuesdays 8AM PST / Sundays 4PM PST).",
    metricLiftLabel: "Target Velocity Output",
    metricLiftValue: "11–14m / 1.4x Week",
  },
];

export const GROWTH_SPRINTS: GrowthSprint[] = [
  {
    id: "sprint-1",
    sprintNumber: 1,
    status: "active",
    statusBadge: "Sprint 1 Active",
    weeksLabel: "Weeks 1 – 3",
    title: "Hook Optimization & Opening Architecture",
    description:
      "Aggressively restructure the first 15 seconds. Eliminate broad greetings and self-introductions; commence instantaneously with narrative stakes.",
    targetMetric: {
      label: "0–3s Hook Hold Rate:",
      valueFormatted: "74.2% → 82.0% (+7.8%)",
      progressPct: 62,
    },
    checklistMeta: "2 of 4 Applied",
    checklist: [
      {
        id: "c1-1",
        title: "Deploy the 'Stinger Cut' Opening Paradigm",
        description:
          "Cold open with the catastrophic wire disaster or finished walnut desk reveal before title card appears. Max audio dynamic range at 0:01s.",
        completed: true,
        statusIcon: "checked",
      },
      {
        id: "c1-2",
        title: "Strict 6-Second Talking Head Rule",
        description:
          "Never allow Nate Chen talking head footage to exceed 0:06 consecutive seconds without macro b-roll, motion graphic callout, or kinetic punch-in.",
        completed: true,
        statusIcon: "checked",
      },
      {
        id: "c1-3",
        title: "Audit Thumbnail-to-First-Frame Visual Match",
        description:
          "Frame #1 must match the color temperature and visual anchor object shown in the thumbnail preview to reduce instant cognitive bounce.",
        completed: false,
        statusIcon: "frame",
      },
    ],
  },
  {
    id: "sprint-2",
    sprintNumber: 2,
    status: "queued",
    statusBadge: "Sprint 2 • Queued",
    weeksLabel: "Weeks 4 – 7",
    title: "Mid-Video Pacing & Retention Bridges",
    description:
      "Systematically dismantle the 0:42s drop-off crater identified across 38 of your last 50 catalog videos.",
    targetMetric: {
      label: "60s Sustained Retention:",
      valueFormatted: "58.0% → 68.0% (+10.0%)",
      progressPct: 35,
    },
    checklistMeta: "Starts Oct 14",
    checklist: [
      {
        id: "c2-1",
        title: "Insert Tactile Foley Bridges at Minute 0:40–0:50",
        description:
          "Transition from abstract desk philosophy directly into high-fidelity tactile audio: click of mechanical switches, wood carving, or cable click.",
        completed: false,
        statusIcon: "clock",
      },
      {
        id: "c2-2",
        title: "Integrate Micro 'Open Loops' at 3:30 and 7:15",
        description:
          "Explicitly foreshadow the final acoustic test or hidden cable compartment that solves the entire premise right before the mid-video dip.",
        completed: false,
        statusIcon: "clock",
      },
    ],
  },
  {
    id: "sprint-3",
    sprintNumber: 3,
    status: "planned",
    statusBadge: "Sprint 3 • Planned",
    weeksLabel: "Weeks 8 – 10",
    title: "Packaging & Topic Selection Calibration",
    description:
      "Prioritize high-performing niche verticals ('Studio Craft & Architecture') over commoditized gadget impressions.",
    targetMetric: {
      label: "72h View Velocity:",
      valueFormatted: "41.8K → 62.0K (+48.3%)",
      progressPct: 15,
    },
    checklistMeta: "Planned Sprint",
    checklist: [
      {
        id: "c3-1",
        title: "Eliminate Spec-Sheet Title Formats",
        description:
          "Replace 'Keychron Q1 Review: Best Keyboard?' with emotional stakes: 'Why I Tossed My $400 Keyboard for This Clean Build'.",
        completed: false,
        statusIcon: "lock",
      },
      {
        id: "c3-2",
        title: "Macro Cinematic Photography A/B Matrix",
        description:
          "Test 3 thumbnail variants: 1) Extreme detail macro, 2) Wide serene studio at dusk, 3) High tension dilemma split.",
        completed: false,
        statusIcon: "lock",
      },
    ],
  },
  {
    id: "sprint-4",
    sprintNumber: 4,
    status: "horizon",
    statusBadge: "Sprint 4 • Horizon",
    weeksLabel: "Weeks 11 – 12",
    title: "Multi-Platform Funnel & Shorts Extraction",
    description:
      "Automate vertical extraction pipelines to feed YouTube Shorts & Instagram Reels using tested 60s hook segments.",
    targetMetric: {
      label: "Top-of-Funnel Inbound Subs:",
      valueFormatted: "+18.5k Subs / Month",
    },
    checklistMeta: "Unlocks Following Sprint 3 Validation",
    unlockMessage:
      "Lumen AI will auto-generate recommended Shorts cut points once 5 long-form sprint videos have posted.",
  },
];

export const PRESCRIBED_EXPERIMENTS: PrescribedVideoExperiment[] = [
  {
    id: "exp-51",
    episodeTag: "Episode #51 • In Scripting",
    title: "I Wasted $800 on Desk Wire Management (Here's What Actually Worked)",
    hypothesis:
      "Framing failure through tangible financial loss triggers 34% higher initial click intent while fulfilling the stinger opening rule.",
    hookCategoryTag: "High Negative Cost Tension",
    estVelocity: "Est. Velocity: 65k",
    targetDuration: "Target Duration: 12m 40s",
    shootDate: "Shoot Date: Oct 08",
    thumbnailSrc: "/images/episode-51.jpg",
  },
  {
    id: "exp-52",
    episodeTag: "Episode #52 • Outline Ready",
    title: "The 10–Minute Studio Overhaul: Real-Time Speed Run",
    hypothesis:
      "Real-time constraint format destroys the 0:42s drop-off by imposing natural urgency and non-stop visual reorganization.",
    hookCategoryTag: "Kinetic Pacing Test",
    estVelocity: "Est. Velocity: 52k",
    targetDuration: "Target Duration: 11m 15s",
    shootDate: "Shoot Date: Oct 15",
    thumbnailSrc: "/images/episode-52.jpg",
  },
  {
    id: "exp-53",
    episodeTag: "Episode #53 • Concept Validated",
    title: "Why Minimalist Workspaces Actually Fail (And What to Do Instead)",
    hypothesis:
      "Challenging your own channel premise creates massive commentary polarization and +60% comment-to-view engagement ratios.",
    hookCategoryTag: "Contrarian Viewpoint",
    estVelocity: "Est. Velocity: 70k",
    targetDuration: "Target Duration: 13m 50s",
    shootDate: "Shoot Date: Oct 22",
    thumbnailSrc: "/images/episode-53.jpg",
  },
];

export const CREATOR_PITFALLS: CreatorPitfall[] = [
  {
    id: "pitfall-1",
    title: "Opening with \"Hey guys, welcome back to the studio...\"",
    metricPenalty: "-24% Retention in 4s",
    description:
      "Your bottom 8 videos all used traditional cordial YouTube welcomes. Viewers decide to click away in 3.8 seconds if no problem is stated.",
    iconName: "ban",
  },
  {
    id: "pitfall-2",
    title: "Extending Runtime Beyond 18 Minutes Without A Sub-Plot",
    metricPenalty: "-38% Relative AVD",
    description:
      "Videos #24 and #39 suffered steep late drops because the narrative was single-threaded. Restrict single-topic videos to 14 mins maximum.",
    iconName: "eye-off",
  },
  {
    id: "pitfall-3",
    title: "Placing Integrated Brand Sponsors at 01:30–03:00",
    metricPenalty: "14,200 View Drop Spike",
    description:
      "Early sponsor integrations destroy the retention ramp. Sponsors must be seamlessly stitched between 05:00 and 07:00 after high value delivery.",
    iconName: "megaphone",
  },
];

export const STRATEGIST_REVIEW: StrategistReview = {
  badge: "STRATEGIC ACCOUNTABILITY",
  title: "Weekly Calibration Review",
  description:
    "Your designated Lumen Growth Strategist (Elena Vance) has flagged Sprint 1 for live cut review. Submit your rough assembly for Episode #51 before final color pass.",
  strategistName: "Elena Vance",
  strategistRole: "Lead Creator Strategist • Ne...",
  strategistInitials: "EV",
};
