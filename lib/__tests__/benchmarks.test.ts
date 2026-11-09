import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiModule from "../api";
import {
  getBenchmarkGoals,
  updateBenchmarkGoal,
  getCreatorBenchmark,
  discoverBenchmarkPeers,
  getBenchmarkGrowthPlan,
  getBenchmarkGroups,
  selectBenchmarkGroup,
} from "../benchmarks";

describe("lib/benchmarks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getBenchmarkGoals", () => {
    it("returns parsed benchmark goals on 200", async () => {
      const mockPayload = {
        selectedGoalId: "GROW_SUBSCRIBERS",
        creatorSnapshot: {
          channelTitle: "Tech Channel",
          subscriberCount: 5000,
          medianViews: 1200,
          currentSubscriberRange: { min: 1000, max: 10000, label: "1K–10K" },
          immediateSubscriberMilestone: 10000,
          goalSubscriberRange: { min: 10000, max: 50000, label: "10K–50K" },
        },
        goals: [],
      };

      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify(mockPayload), { status: 200 }),
      );

      const result = await getBenchmarkGoals();
      expect(result).toEqual(mockPayload);
      expect(apiModule.apiFetch).toHaveBeenCalledWith(
        apiModule.benchmarksGoalsUrl,
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("throws UNAUTHORIZED on 401 and server message on 500", async () => {
      vi.spyOn(apiModule, "apiFetch").mockResolvedValueOnce(
        new Response(null, { status: 401 }),
      );
      await expect(getBenchmarkGoals()).rejects.toThrow("UNAUTHORIZED");

      vi.spyOn(apiModule, "apiFetch").mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "Goals unavailable" }), {
          status: 500,
        }),
      );
      await expect(getBenchmarkGoals()).rejects.toThrow("Goals unavailable");
    });
  });

  describe("updateBenchmarkGoal", () => {
    it("sends POST with goalId and refreshPeers payload", async () => {
      const responseData = {
        message: "Updated",
        selectedGoalId: "IMPROVE_VIEWERSHIP",
      };
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify(responseData), { status: 200 }),
      );

      const res = await updateBenchmarkGoal({
        goalId: "IMPROVE_VIEWERSHIP",
        refreshPeers: true,
      });

      expect(res).toEqual(responseData);
      expect(apiModule.apiFetch).toHaveBeenCalledWith(
        apiModule.benchmarksGoalsUrl,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            goalId: "IMPROVE_VIEWERSHIP",
            refreshPeers: true,
          }),
        }),
      );
    });
  });

  describe("getCreatorBenchmark", () => {
    it("fetches without query string when no params provided", async () => {
      const mockResult = { hasData: true };
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify(mockResult), { status: 200 }),
      );

      const res = await getCreatorBenchmark();
      expect(res).toEqual(mockResult);
      expect(apiModule.apiFetch).toHaveBeenCalledWith(
        apiModule.benchmarksUrl,
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("appends goal and refresh query params when provided", async () => {
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify({ hasData: true }), { status: 200 }),
      );

      await getCreatorBenchmark({
        goal: "GROW_SUBSCRIBERS",
        refresh: true,
      });

      expect(apiModule.apiFetch).toHaveBeenCalledWith(
        `${apiModule.benchmarksUrl}?goal=GROW_SUBSCRIBERS&refresh=true`,
        expect.objectContaining({ method: "GET" }),
      );
    });
  });

  describe("discoverBenchmarkPeers", () => {
    it("posts payload to discover endpoint", async () => {
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify({ hasData: true }), { status: 200 }),
      );

      await discoverBenchmarkPeers({ goalId: "GROW_SUBSCRIBERS" });
      expect(apiModule.apiFetch).toHaveBeenCalledWith(
        apiModule.benchmarksDiscoverUrl,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ goalId: "GROW_SUBSCRIBERS" }),
        }),
      );
    });
  });

  describe("getBenchmarkGrowthPlan, getBenchmarkGroups & selectBenchmarkGroup", () => {
    it("fetches growth plan", async () => {
      const plan = { hasData: true, growthPlan: null };
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify(plan), { status: 200 }),
      );

      await expect(getBenchmarkGrowthPlan()).resolves.toEqual(plan);
      expect(apiModule.apiFetch).toHaveBeenCalledWith(
        apiModule.benchmarksGrowthPlanUrl,
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("fetches benchmark groups", async () => {
      const groups = { totalGroups: 1, groups: [{ id: "g1" }] };
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify(groups), { status: 200 }),
      );

      await expect(getBenchmarkGroups()).resolves.toEqual(groups);
      expect(apiModule.apiFetch).toHaveBeenCalledWith(
        `${apiModule.benchmarksUrl}/groups`,
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("selects a benchmark group", async () => {
      const payload = {
        message: "Selected",
        benchmarkGroup: { id: "g1", name: "Tech 1K-10K" },
      };
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify(payload), { status: 200 }),
      );

      await expect(selectBenchmarkGroup("g1")).resolves.toEqual(payload);
      expect(apiModule.apiFetch).toHaveBeenCalledWith(
        `${apiModule.benchmarksUrl}/select`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ benchmarkGroupId: "g1" }),
        }),
      );
    });
  });
});

