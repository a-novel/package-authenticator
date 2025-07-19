import "#/utils/setup";

import * as authForm from "./auth.form";
import * as session from "./session";
import { SessionPrivateSuspense } from "./session.private.suspense";
import { MockSession } from "./session.test";

import { render, waitFor } from "@testing-library/react";
import { it, describe, expect, vi } from "vitest";

describe("session private provider", () => {
  it("renders login form when not authenticated", async () => {
    const selectForm = vi.fn();

    const spyAuthForm = vi.spyOn(authForm, "useAuthForm").mockImplementation(() => ({
      selectForm: selectForm,
      selectedForm: undefined,
    }));
    const spySession = vi.spyOn(session, "useSession").mockImplementation(() => ({
      session: undefined,
      synced: true,
      setSession: vi.fn(),
    }));

    const screen = render(
      <SessionPrivateSuspense>
        <div>Hello world!</div>
      </SessionPrivateSuspense>
    );

    await waitFor(() => {
      expect(spyAuthForm).toHaveBeenCalled();
      expect(spySession).toHaveBeenCalled();
      expect(selectForm).toHaveBeenCalledWith("login");
      expect(screen.queryByText("Hello world!")).toBeNull();
    });
  });

  it("renders children when authenticated", async () => {
    const selectForm = vi.fn();

    const spyAuthForm = vi.spyOn(authForm, "useAuthForm").mockImplementation(() => ({
      selectForm: selectForm,
      selectedForm: undefined,
    }));
    const spySession = vi.spyOn(session, "useSession").mockImplementation(() => ({
      session: MockSession,
      synced: true,
      setSession: vi.fn(),
    }));

    const screen = render(
      <SessionPrivateSuspense>
        <div>Hello world!</div>
      </SessionPrivateSuspense>
    );

    await waitFor(() => {
      expect(spyAuthForm).toHaveBeenCalled();
      expect(spySession).toHaveBeenCalled();
      expect(selectForm).toHaveBeenCalledWith(undefined);
      expect(screen.queryByText("Hello world!")).not.toBeNull();
    });
  });

  it("renders login form when authenticated anonymously", async () => {
    const selectForm = vi.fn();

    const spyAuthForm = vi.spyOn(authForm, "useAuthForm").mockImplementation(() => ({
      selectForm: selectForm,
      selectedForm: undefined,
    }));
    const spySession = vi.spyOn(session, "useSession").mockImplementation(() => ({
      session: {
        accessToken: "access-token",
      },
      synced: true,
      setSession: vi.fn(),
    }));

    const screen = render(
      <SessionPrivateSuspense>
        <div>Hello world!</div>
      </SessionPrivateSuspense>
    );

    await waitFor(() => {
      expect(spyAuthForm).toHaveBeenCalled();
      expect(spySession).toHaveBeenCalled();
      expect(selectForm).toHaveBeenCalledWith("login");
      expect(screen.queryByText("Hello world!")).toBeNull();
    });
  });
});
