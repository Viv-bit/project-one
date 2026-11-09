import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiModule from "../api";
import {
  getCreatorProfile,
  getCreatorOverview,
  getCreatorContent,
} from "../creator";
import {
  getExperiments,
  getExperimentById,
  createExperiment,
  updateExperiment,
  linkPostToExperiment,
  evaluateExperimentResults,
} from "../experiments";
import {
  getInsights,
  getRecommendations,
  getRecommendationById,
} from "../insights";
import { cn } from "../cn";
import { queryKeys } from "../query-keys";

describe("lib/creator, experiments, insights & utilities", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("lib/creator", () => {
    it("fetches creator profile, overview, and content", async () => {
      const profile = {
        channel: { id: "c1", title: "Chan" },
        profile: { inferredNiche: "Tech" },
      };
      const overview = { totals: { totalVideos: 10 } };
      const content = { byTopic: [], byPillar: [] };

      vi.spyOn(apiModule, "apiFetch")
        .mockResolvedValueOnce(
          new Response(JSON.stringify(profile), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(overview), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(content), { status: 200 }),
        );

      await expect(getCreatorProfile()).resolves.toEqual(profile);
      await expect(getCreatorOverview()).resolves.toEqual(overview);
      await expect(getCreatorContent()).resolves.toEqual(content);
    });
  });

  describe("lib/experiments", () => {
    it("handles wrapped { experiments } and array responses in getExperiments", async () => {
      const exp = { id: "exp-1", title: "Hook Test" };
      vi.spyOn(apiModule, "apiFetch")
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ experiments: [exp] }), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify([exp]), { status: 200 }),
        );

      await expect(getExperiments()).resolves.toEqual([exp]);
      await expect(getExperiments()).resolves.toEqual([exp]);
    });

    it("returns null on 404 in getExperimentById", async () => {
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(null, { status: 404 }),
      );
      await expect(getExperimentById("missing")).resolves.toBeNull();
    });

    it("creates, updates, links post, and evaluates experiment", async () => {
      const exp = { id: "exp-1", title: "Hook Test" };
      const evalResult = { id: "res-1", conclusion: "POSITIVE" };

      vi.spyOn(apiModule, "apiFetch")
        .mockResolvedValueOnce(
          new Response(JSON.stringify(exp), { status: 201 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ ...exp, status: "ACTIVE" }), {
            status: 200,
          }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(exp), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(evalResult), { status: 200 }),
        );

      await expect(
        createExperiment({
          title: "Hook Test",
          hypothesis: "Questions lift views",
          category: "HOOKS",
        }),
      ).resolves.toEqual(exp);

      await expect(
        updateExperiment("exp-1", { status: "ACTIVE" }),
      ).resolves.toEqual({ ...exp, status: "ACTIVE" });

      await expect(linkPostToExperiment("exp-1", "post-9")).resolves.toEqual(
        exp,
      );

      await expect(evaluateExperimentResults("exp-1")).resolves.toEqual(
        evalResult,
      );
    });
  });

  describe("lib/insights", () => {
    it("normalizes array response and passes query filters in getInsights", async () => {
      const items = [
        { id: "i1", priority: "HIGH" },
        { id: "i2", priority: "MEDIUM" },
      ];
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify(items), { status: 200 }),
      );

      const res = await getInsights({ priority: "HIGH", category: "HOOKS" });
      expect(res).toEqual({
        totalInsights: 2,
        highPriorityCount: 1,
        insights: items,
      });
      expect(apiModule.apiFetch).toHaveBeenCalledWith(
        `${apiModule.insightsUrl}?priority=HIGH&category=HOOKS`,
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("normalizes array response in getRecommendations and handles 404 in getRecommendationById", async () => {
      const recs = [{ id: "r1", priority: "HIGH" }];
      vi.spyOn(apiModule, "apiFetch")
        .mockResolvedValueOnce(
          new Response(JSON.stringify(recs), { status: 200 }),
        )
        .mockResolvedValueOnce(new Response(null, { status: 404 }));

      await expect(getRecommendations()).resolves.toEqual({
        totalRecommendations: 1,
        highPriorityCount: 1,
        recommendations: recs,
      });

      await expect(getRecommendationById("missing")).resolves.toBeNull();
    });
  });

  describe("lib/cn & lib/query-keys", () => {
    it("merges Tailwind classes properly", () => {
      expect(cn("px-2 py-1", false && "hidden", "px-4")).toBe("py-1 px-4");
    });

    it("builds deterministic react-query keys", () => {
      expect(queryKeys.auth.user()).toEqual(["auth", "user"]);
      expect(queryKeys.youtube.videos(25)).toEqual([
        "youtube",
        "videos",
        { limit: 25 },
      ]);
      expect(queryKeys.benchmarks.growthPlan()).toEqual([
        "benchmarks",
        "growth-plan",
      ]);
    });
  });
});

