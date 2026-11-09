import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { useAnalyticsStore } from "@/lib/store/analytics-store";

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

describe("Feature: Authentication Flows (SignInForm & SignUpForm)", () => {
  const sampleUser = {
    id: "user-auth-1",
    email: "alex@creativeflow.studio",
    name: "Alex Rivers",
    createdAt: "2026-01-01T00:00:00Z",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    pushMock.mockReset();
    refreshMock.mockReset();
    useAnalyticsStore.setState({ currentUser: null });
  });

  describe("SignInForm", () => {
    it("signs in a user, updates analytics store, and redirects to /dashboard", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ message: "Signed in", user: sampleUser }),
          { status: 200 },
        ),
      );
      vi.stubGlobal("fetch", fetchMock);

      render(<SignInForm />);

      fireEvent.change(screen.getByLabelText(/Creator Email/i), {
        target: { value: "alex@creativeflow.studio" },
      });
      fireEvent.change(screen.getByLabelText(/^Password/i), {
        target: { value: "SecretPass123!" },
      });

      fireEvent.click(
        screen.getByRole("button", { name: /Sign In to Dashboard/i }),
      );

      await waitFor(() => {
        expect(useAnalyticsStore.getState().currentUser).toEqual(sampleUser);
        expect(pushMock).toHaveBeenCalledWith("/dashboard");
        expect(refreshMock).toHaveBeenCalled();
      });
    });

    it("renders error alert when backend returns 401 unauthorized", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
          }),
        ),
      );

      render(<SignInForm />);

      fireEvent.change(screen.getByLabelText(/Creator Email/i), {
        target: { value: "alex@creativeflow.studio" },
      });
      fireEvent.change(screen.getByLabelText(/^Password/i), {
        target: { value: "wrong-password" },
      });

      fireEvent.click(
        screen.getByRole("button", { name: /Sign In to Dashboard/i }),
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Invalid email or password/i),
        ).toBeInTheDocument();
      });
      expect(pushMock).not.toHaveBeenCalled();
    });
  });

  describe("SignUpForm", () => {
    it("validates password length and terms of service before making network call", async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);

      render(<SignUpForm />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: "Alex Rivers" },
      });
      fireEvent.change(screen.getByLabelText(/Work or Creator Email/i), {
        target: { value: "alex@creativeflow.studio" },
      });
      fireEvent.change(screen.getByLabelText(/^Password/i), {
        target: { value: "short" },
      });

      fireEvent.submit(
        screen
          .getByRole("button", { name: /Create Free Account/i })
          .closest("form")!,
      );

      expect(
        await screen.findByText(/Password must be at least 8 characters/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/You must agree to the Terms of Service/i),
      ).toBeInTheDocument();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("creates account, stores user in Zustand, and redirects to /dashboard", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({ message: "Registered", user: sampleUser }),
            { status: 201 },
          ),
        ),
      );

      render(<SignUpForm />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: "Alex Rivers" },
      });
      fireEvent.change(screen.getByLabelText(/Work or Creator Email/i), {
        target: { value: "alex@creativeflow.studio" },
      });
      fireEvent.change(screen.getByLabelText(/^Password/i), {
        target: { value: "StrongPassword123!" },
      });
      fireEvent.click(screen.getByRole("checkbox"));

      fireEvent.click(
        screen.getByRole("button", { name: /Create Free Account/i }),
      );

      await waitFor(() => {
        expect(useAnalyticsStore.getState().currentUser).toEqual(sampleUser);
        expect(pushMock).toHaveBeenCalledWith("/dashboard");
      });
    });

    it("surfaces duplicate email conflict on 409 response", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({ message: "Email already registered" }),
            { status: 409 },
          ),
        ),
      );

      render(<SignUpForm />);

      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: "Alex Rivers" },
      });
      fireEvent.change(screen.getByLabelText(/Work or Creator Email/i), {
        target: { value: "alex@creativeflow.studio" },
      });
      fireEvent.change(screen.getByLabelText(/^Password/i), {
        target: { value: "StrongPassword123!" },
      });
      fireEvent.click(screen.getByRole("checkbox"));

      fireEvent.click(
        screen.getByRole("button", { name: /Create Free Account/i }),
      );

      await waitFor(() => {
        expect(
          screen.getAllByText(/An account with this email already exists/i)
            .length,
        ).toBeGreaterThanOrEqual(1);
      });
    });
  });
});

