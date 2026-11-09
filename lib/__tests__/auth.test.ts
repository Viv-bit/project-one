import { describe, it, expect, vi, beforeEach } from "vitest";
import * as apiModule from "../api";
import {
  AuthApiError,
  signupUser,
  signinUser,
  getCurrentUser,
} from "../auth";
import { useAnalyticsStore } from "../store/analytics-store";

describe("lib/auth", () => {
  const sampleUser = {
    id: "user-123",
    email: "user@example.com",
    name: "Jane Creator",
    createdAt: "2026-01-01T00:00:00Z",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    useAnalyticsStore.setState({ currentUser: null });
  });

  describe("signupUser", () => {
    it("registers user and stores authenticated user in analytics store", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({ message: "Created", user: sampleUser }),
            { status: 201 },
          ),
        ),
      );

      const res = await signupUser({
        email: sampleUser.email,
        password: "Password123!",
      });

      expect(res.user).toEqual(sampleUser);
      expect(useAnalyticsStore.getState().currentUser).toEqual(sampleUser);
    });

    it("throws AuthApiError with default conflict message on 409 without body", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(new Response("Not JSON", { status: 409 })),
      );

      await expect(
        signupUser({ email: sampleUser.email, password: "Password123!" }),
      ).rejects.toMatchObject({
        name: "AuthApiError",
        status: 409,
        message: "An account with this email already exists",
      });
    });

    it("preserves validation fieldErrors from server response", async () => {
      const errors = { password: ["Too short"] };
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({ message: "Validation failed", errors }),
            { status: 400 },
          ),
        ),
      );

      try {
        await signupUser({ email: sampleUser.email, password: "123" });
        expect.unreachable("Should have thrown AuthApiError");
      } catch (err) {
        expect(err).toBeInstanceOf(AuthApiError);
        expect((err as AuthApiError).fieldErrors).toEqual(errors);
      }
    });
  });

  describe("signinUser", () => {
    it("signs in user and sets currentUser in store", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ message: "OK", user: sampleUser }), {
            status: 200,
          }),
        ),
      );

      const res = await signinUser({
        email: sampleUser.email,
        password: "Password123!",
      });

      expect(res.user).toEqual(sampleUser);
      expect(useAnalyticsStore.getState().currentUser).toEqual(sampleUser);
    });

    it("throws AuthApiError with Invalid email or password on 401", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(new Response(null, { status: 401 })),
      );

      await expect(
        signinUser({ email: sampleUser.email, password: "wrong" }),
      ).rejects.toMatchObject({
        status: 401,
        message: "Invalid email or password",
      });
    });
  });

  describe("getCurrentUser", () => {
    it("resolves wrapped { user } payload and updates store", async () => {
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(JSON.stringify({ user: sampleUser }), { status: 200 }),
      );

      const user = await getCurrentUser();
      expect(user).toEqual(sampleUser);
      expect(useAnalyticsStore.getState().currentUser).toEqual(sampleUser);
    });

    it("clears session and returns null on 401", async () => {
      useAnalyticsStore.setState({ currentUser: sampleUser });
      vi.spyOn(apiModule, "apiFetch").mockResolvedValue(
        new Response(null, { status: 401 }),
      );

      const user = await getCurrentUser();
      expect(user).toBeNull();
      expect(useAnalyticsStore.getState().currentUser).toBeNull();
    });
  });
});

