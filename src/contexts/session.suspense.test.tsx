import { MockQueryClient } from "#/mocks/query_client";
import "#/mocks/tolgee";
import { genericSetup } from "#/utils/setup";
import { QueryWrapper, StandardWrapper } from "#/utils/wrapper";

import { SESSION_STORAGE_KEY, SessionProvider, useSession } from "./session";
import { SessionSuspense } from "./session.suspense";
import { MockFreshSession, MockSession } from "./session.test";

import { UnauthorizedError } from "@a-novel/connector-authentication/api";

import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { act, render, renderHook, waitFor } from "@testing-library/react";
import nock from "nock";
import { describe, expect, it } from "vitest";

let nockAPI: nock.Scope;

describe("session suspense", () => {
  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("loads a session initially, if none is present", async () => {
    const nockLogin = nockAPI.put("/session/anon").reply(200, {
      accessToken: "access-token",
    });

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: ["auth:anon"],
      });

    const queryClient = new QueryClient(MockQueryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(
      () => {
        nockSession.done();
        nockLogin.done();
      },
      { timeout: 2000 }
    );

    await waitFor(() => {
      expect(screen.queryByText("Hello world!")).not.toBeNull();
    });
  });

  it("does nothing, if an initial session is present", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(MockSession));

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: ["auth:anon"],
      });

    const queryClient = new QueryClient(MockQueryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(
      () => {
        nockSession.done();
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByText("Hello world!")).not.toBeNull();
      },
      { timeout: 2000 }
    );
  });

  it("does nothing, if an initial anonymous session is present", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ accessToken: "access-token" }));

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        roles: ["auth:anon"],
      });

    const queryClient = new QueryClient(MockQueryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(
      () => {
        nockSession.done();
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByText("Hello world!")).not.toBeNull();
      },
      { timeout: 2000 }
    );
  });

  it("does not render until session is available", async () => {
    const nockLogin = nockAPI.put("/session/anon").reply(200, {
      accessToken: "access-token",
    });

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: ["auth:anon"],
      });

    const queryClient = new QueryClient(MockQueryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(() => {
      expect(screen.queryByText(/session:status\.loading/)).not.toBeNull();
      expect(screen.queryByText("Hello world!")).toBeNull();
    });

    await waitFor(
      () => {
        nockLogin.done();
        nockSession.done();
      },
      { timeout: 2000 }
    );

    await waitFor(() => {
      expect(screen.queryByText("Hello world!")).not.toBeNull();
    });
  });

  it("renders an error on login error", async () => {
    const nockLogin = nockAPI.put("/session/anon").reply(500);

    const queryClient = new QueryClient(MockQueryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(
      () => {
        nockLogin.done();
      },
      { timeout: 2000 }
    );

    await waitFor(() => {
      expect(screen.queryByText(/session:status\.error/)).not.toBeNull();
      expect(screen.queryByText("Hello world!")).toBeNull();
    });

    const retryButton = screen.getByRole("button", { name: /session:actions\.retry/ });

    const nockLoginRetry = nockAPI.put("/session/anon").reply(200, {
      accessToken: "access-token",
    });

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: ["auth:anon"],
      });

    act(() => {
      retryButton.click();
    });

    await waitFor(() => {
      nockLoginRetry.done();
      nockSession.done();
    });

    await waitFor(() => {
      expect(screen.queryByText("Hello world!")).not.toBeNull();
    });
  });

  it("fetches a refresh token on a new authenticated session", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(MockFreshSession));

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: ["auth:anon"],
      });

    const nockRefreshToken = nockAPI
      .put("/session/refresh", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, { refreshToken: "refresh-token" });

    const queryClient = new QueryClient(MockQueryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(
      () => {
        nockSession.done();
        nockRefreshToken.done();
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByText("Hello world!")).not.toBeNull();
      },
      { timeout: 2000 }
    );

    const sessionHook = renderHook(() => useSession(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <StandardWrapper>
          <QueryClientProvider client={queryClient}>
            <SessionProvider>{children}</SessionProvider>
          </QueryClientProvider>
        </StandardWrapper>
      ),
    });

    await waitFor(() => {
      expect(sessionHook.result.current.session?.refreshToken).toEqual("refresh-token");
    });
  });

  it("while unauthenticated, creates a new anonymous session on unauthorized error", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ accessToken: "access-token" }));

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        roles: ["auth:anon"],
      });

    const queryClient = new QueryClient(MockQueryClient);

    const queryWrapper = QueryWrapper(queryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: queryWrapper }
    );

    await waitFor(
      () => {
        nockSession.done();
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByText("Hello world!")).not.toBeNull();
      },
      { timeout: 2000 }
    );

    const nockSession2 = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        roles: ["auth:anon"],
      });

    const nockLogin = nockAPI.put("/session/anon").reply(200, {
      accessToken: "access-token",
    });

    // Trigger a 401 / unauthorized call.
    renderHook(
      () => {
        return useQuery({
          queryKey: ["test"],
          queryFn: async () => {
            // Bypass the retry delay.
            await new Promise((resolve) => setTimeout(resolve, 500));
            throw new UnauthorizedError("foo");
          },
        });
      },
      { wrapper: queryWrapper }
    );

    await waitFor(
      () => {
        nockLogin.done();
        nockSession2.done();
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByText("Hello world!")).not.toBeNull();
      },
      { timeout: 2000 }
    );
  });

  it("while authenticated, refresh the token on unauthorized error", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(MockSession));

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: ["auth:anon"],
      });

    const queryClient = new QueryClient(MockQueryClient);

    const queryWrapper = QueryWrapper(queryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: queryWrapper }
    );

    await waitFor(
      () => {
        nockSession.done();
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByText("Hello world!")).not.toBeNull();
      },
      { timeout: 2000 }
    );

    const nockSession2 = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: ["auth:anon"],
      });

    const nockLogin = nockAPI.patch("/session/refresh?accessToken=access-token&refreshToken=refresh-token").reply(200, {
      accessToken: "access-token",
    });

    // Trigger a 401 / unauthorized call.
    renderHook(
      () => {
        return useQuery({
          queryKey: ["test"],
          queryFn: async () => {
            // Bypass the retry delay.
            await new Promise((resolve) => setTimeout(resolve, 500));
            throw new UnauthorizedError("foo");
          },
        });
      },
      { wrapper: queryWrapper }
    );

    await waitFor(
      () => {
        nockLogin.done();
        nockSession2.done();
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByText("Hello world!")).not.toBeNull();
      },
      { timeout: 2000 }
    );
  });

  it("while authenticated, if refresh token fails, fallback to anonymous session", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(MockSession));

    const nockSession = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: ["auth:anon"],
      });

    const queryClient = new QueryClient(MockQueryClient);

    const queryWrapper = QueryWrapper(queryClient);

    const screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: queryWrapper }
    );

    await waitFor(
      () => {
        nockSession.done();
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByText("Hello world!")).not.toBeNull();
      },
      { timeout: 2000 }
    );

    const nockSession2 = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        roles: ["auth:anon"],
      });

    const nockLogin = nockAPI
      .patch("/session/refresh?accessToken=access-token&refreshToken=refresh-token")
      .reply(403, {})
      .put("/session/anon")
      .reply(200, {
        accessToken: "access-token",
      });

    // Trigger a 401 / unauthorized call.
    renderHook(
      () => {
        return useQuery({
          queryKey: ["test"],
          queryFn: async () => {
            // Bypass the retry delay.
            await new Promise((resolve) => setTimeout(resolve, 500));
            throw new UnauthorizedError("foo");
          },
        });
      },
      { wrapper: queryWrapper }
    );

    await waitFor(
      () => {
        nockLogin.done();
        nockSession2.done();
      },
      { timeout: 2000 }
    );

    await waitFor(
      () => {
        expect(screen.queryByText("Hello world!")).not.toBeNull();
      },
      { timeout: 2000 }
    );
  });
});
