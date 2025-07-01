import { genericSetup } from "#/utils/setup";
import { StandardWrapper } from "#/utils/wrapper";

import { SESSION_STORAGE_KEY, type SessionContextType, SessionProvider, useAccessToken, useSession } from "./session";

import { ClaimsRoleEnum } from "@a-novel/connector-authentication/api";

import { type FC, useEffect } from "react";

import { render, waitFor } from "@testing-library/react";
import { it, describe, expect } from "vitest";

export const TestSessionRenderer: FC<{ session?: SessionContextType["session"] | null }> = ({
  session: sessionProps,
}) => {
  const { session, setSession } = useSession();

  useEffect(() => {
    if (sessionProps !== undefined) setSession(sessionProps ?? undefined);
  }, [setSession, sessionProps]);

  return <div data-testid="session">{JSON.stringify(session)}</div>;
};

const TestAccessTokenRenderer: FC = () => {
  const accessToken = useAccessToken();
  return <div data-testid="accesstoken">{accessToken}</div>;
};

export const MockSession: SessionContextType["session"] = {
  claims: {
    userID: "00000000-0000-0000-0000-000000000001",
    roles: [ClaimsRoleEnum.User],
    refreshTokenID: "00000000-0000-0000-0000-000000000002",
  },
  accessToken: "access-token",
  refreshToken: "refresh-token",
};

describe("session provider", () => {
  genericSetup({});

  it("returns session from context", async () => {
    const screen = render(
      <SessionProvider>
        <TestSessionRenderer />
      </SessionProvider>,
      { wrapper: StandardWrapper }
    );

    let session: HTMLElement;
    await waitFor(
      () => {
        session = screen.getByTestId("session");
        expect(session).toBeDefined();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(session.innerHTML).toEqual("");
      },
      { timeout: 1000 }
    );
  });

  it("loads session from storage", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(MockSession));

    const screen = render(
      <SessionProvider>
        <TestSessionRenderer />
      </SessionProvider>,
      { wrapper: StandardWrapper }
    );

    let session: HTMLElement;
    await waitFor(
      () => {
        session = screen.getByTestId("session");
        expect(session).toBeDefined();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(session.innerHTML).toEqual(JSON.stringify(MockSession));
      },
      { timeout: 1000 }
    );
  });

  it("syncs updates with local storage", async () => {
    const screen = render(
      <SessionProvider>
        <TestSessionRenderer />
      </SessionProvider>,
      { wrapper: StandardWrapper }
    );

    let session: HTMLElement;
    await waitFor(
      () => {
        session = screen.getByTestId("session");
        expect(session).toBeDefined();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(session.innerHTML).toEqual("");
        expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
      },
      { timeout: 1000 }
    );

    screen.rerender(
      <SessionProvider>
        <TestSessionRenderer session={MockSession} />
      </SessionProvider>
    );

    await waitFor(
      () => {
        expect(session.innerHTML).toEqual(JSON.stringify(MockSession));
        expect(localStorage.getItem(SESSION_STORAGE_KEY)).toEqual(JSON.stringify(MockSession));
      },
      { timeout: 1000 }
    );

    screen.rerender(
      <SessionProvider>
        <TestSessionRenderer session={null} />
      </SessionProvider>
    );

    await waitFor(
      () => {
        expect(session.innerHTML).toEqual("");
        expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
      },
      { timeout: 1000 }
    );
  });

  it("returns access token from context", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(MockSession));

    const screen = render(
      <SessionProvider>
        <TestAccessTokenRenderer />
      </SessionProvider>,
      { wrapper: StandardWrapper }
    );

    let accessToken: HTMLElement;
    await waitFor(
      () => {
        accessToken = screen.getByTestId("accesstoken");
        expect(accessToken).toBeDefined();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(accessToken.innerHTML).toEqual("access-token");
      },
      { timeout: 1000 }
    );
  });

  it("returns empty access token from context", async () => {
    const screen = render(
      <SessionProvider>
        <TestAccessTokenRenderer />
      </SessionProvider>,
      { wrapper: StandardWrapper }
    );

    let accessToken: HTMLElement;
    await waitFor(
      () => {
        accessToken = screen.getByTestId("accesstoken");
        expect(accessToken).toBeDefined();
      },
      { timeout: 1000 }
    );

    await waitFor(
      () => {
        expect(accessToken.innerHTML).toEqual("");
      },
      { timeout: 1000 }
    );
  });
});
