import "#/mocks/tolgee";
import { server } from "#/utils/setup";
import { QueryWrapper } from "#/utils/wrapper";

import { SESSION_STORAGE_KEY, type SessionContextType, SessionProvider } from "./session";
import { SessionSuspense } from "./session.suspense";
import { MockSession } from "./session.test";

import { UnauthorizedError } from "@a-novel/connector-authentication/api";
import { MockQueryClient } from "@a-novel/nodelib/mocks/query_client";
import { http } from "@a-novel/nodelib/msw";

import { QueryClient, useQuery } from "@tanstack/react-query";
import { render, renderHook, type RenderResult, waitFor } from "@testing-library/react";
import { HttpResponse, RequestHandler } from "msw";
import { describe, expect, it } from "vitest";

interface TestCase {
  initialStorageSession?: SessionContextType["session"];
  preAction?: (queryClient: QueryClient) => void | Promise<void>;
  apiCalls?: RequestHandler[];
  expectRender: string | RegExp;
  then?: (screen: RenderResult) => TestCase;
  skip?: boolean;
}

const executeTestCase = async (testCase: TestCase, screen?: RenderResult, queryClient?: QueryClient) => {
  if (testCase.initialStorageSession) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(testCase.initialStorageSession));
  }

  server.use(...(testCase.apiCalls ?? []));

  if (!queryClient) {
    queryClient = new QueryClient(MockQueryClient);
  }

  if (testCase.preAction) {
    await testCase.preAction(queryClient);
  }

  if (!screen) {
    screen = render(
      <SessionProvider>
        <SessionSuspense>
          <div>Hello world!</div>
        </SessionSuspense>
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    ) as RenderResult;
  }

  await waitFor(() => {
    expect((screen as RenderResult).queryByText(testCase.expectRender)).not.toBeNull();
  });

  if (testCase.then) {
    return executeTestCase(testCase.then(screen as RenderResult), screen, queryClient);
  }
};

describe("session suspense", async () => {
  const testCases: Record<string, TestCase> = {
    "loads a session initially, if none is present": {
      apiCalls: [
        http
          .put("http://localhost:3000/session/anon")
          .resolve(() => HttpResponse.json({ accessToken: "access-token" })),
        http
          .get("http://localhost:3000/session")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .resolve(() => HttpResponse.json({ roles: ["auth:anon"] })),
      ],
      expectRender: "Hello world!",
    },
    "does nothing, if an initial session is present": {
      initialStorageSession: MockSession,
      apiCalls: [
        http
          .get("http://localhost:3000/session")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .resolve(() => HttpResponse.json({ userID: "94b4d288-dbff-4eca-805a-f45311a34e15", roles: ["auth:user"] })),
      ],
      expectRender: "Hello world!",
    },
    "does nothing, if an initial anonymous session is present": {
      initialStorageSession: { accessToken: "access-token" },
      apiCalls: [
        http
          .get("http://localhost:3000/session")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .resolve(() => HttpResponse.json({ roles: ["auth:anon"] })),
      ],
      expectRender: "Hello world!",
    },
    "while unauthenticated, creates a new anonymous session on unauthorized error": {
      initialStorageSession: { accessToken: "access-token" },
      apiCalls: [
        http
          .get("http://localhost:3000/session")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .resolve(() => HttpResponse.json({ roles: ["auth:anon"] })),
      ],
      expectRender: "Hello world!",
      then: () => ({
        preAction: async (queryClient) => {
          // Trigger a 401 / unauthorized call.
          renderHook(
            () =>
              useQuery({
                queryKey: ["test"],
                queryFn: async () => {
                  // Bypass the authentication delay.
                  await new Promise((resolve) => setTimeout(resolve, 500));
                  throw new UnauthorizedError("foo");
                },
              }),
            { wrapper: QueryWrapper(queryClient) }
          );
        },
        apiCalls: [
          http
            .put("http://localhost:3000/session/anon")
            .resolve(() => HttpResponse.json({ accessToken: "access-token" })),
          http
            .get("http://localhost:3000/session")
            .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
            .resolve(() => HttpResponse.json({ roles: ["auth:anon"] })),
        ],
        expectRender: "Hello world!",
      }),
    },
    "while authenticated, refresh the token on unauthorized error": {
      initialStorageSession: MockSession,
      apiCalls: [
        http
          .get("http://localhost:3000/session")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .resolve(() => HttpResponse.json({ userID: "94b4d288-dbff-4eca-805a-f45311a34e15", roles: ["auth:user"] })),
      ],
      expectRender: "Hello world!",
      then: () => ({
        preAction: async (queryClient) => {
          // Trigger a 401 / unauthorized call.
          renderHook(
            () =>
              useQuery({
                queryKey: ["test"],
                queryFn: async () => {
                  // Bypass the authentication delay.
                  await new Promise((resolve) => setTimeout(resolve, 500));
                  throw new UnauthorizedError("foo");
                },
              }),
            { wrapper: QueryWrapper(queryClient) }
          );
        },
        apiCalls: [
          http
            .patch("http://localhost:3000/session/refresh")
            .searchParams(
              new URLSearchParams({ accessToken: "access-token", refreshToken: "refresh-token" }),
              true,
              HttpResponse.error()
            )
            .resolve(() => HttpResponse.json({ accessToken: "access-token" })),
          http
            .get("http://localhost:3000/session")
            .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
            .resolve(() => HttpResponse.json({ userID: "94b4d288-dbff-4eca-805a-f45311a34e15", roles: ["auth:anon"] })),
        ],
        expectRender: "Hello world!",
      }),
    },
    "while authenticated, if refresh token fails, fallback to anonymous session": {
      initialStorageSession: MockSession,
      apiCalls: [
        http
          .get("http://localhost:3000/session")
          .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
          .resolve(() => HttpResponse.json({ userID: "94b4d288-dbff-4eca-805a-f45311a34e15", roles: ["auth:user"] })),
      ],
      expectRender: "Hello world!",
      then: () => ({
        preAction: (queryClient) => {
          // Trigger a 401 / unauthorized call.
          renderHook(
            () =>
              useQuery({
                queryKey: ["test"],
                queryFn: async () => {
                  // Bypass the retry delay.
                  await new Promise((resolve) => setTimeout(resolve, 500));
                  throw new UnauthorizedError("foo");
                },
              }),
            { wrapper: QueryWrapper(queryClient) }
          );
        },
        apiCalls: [
          http
            .get("http://localhost:3000/session")
            .headers(new Headers({ Authorization: "Bearer access-token" }), HttpResponse.error())
            .resolve(() => HttpResponse.json({ roles: ["auth:anon"] })),
          http
            .patch("http://localhost:3000/session/refresh", { once: true })
            .searchParams(
              new URLSearchParams({ accessToken: "access-token", refreshToken: "refresh-token" }),
              true,
              HttpResponse.error()
            )
            .resolve(() => HttpResponse.json(undefined, { status: 403 })),
          http
            .patch("http://localhost:3000/session/refresh")
            .searchParams(
              new URLSearchParams({ accessToken: "access-token", refreshToken: "refresh-token" }),
              true,
              HttpResponse.error()
            )
            .resolve(() => HttpResponse.json({ accessToken: "access-token" })),
        ],
        expectRender: "Hello world!",
      }),
    },
  };

  for (const [testCaseName, testCase] of Object.entries(testCases)) {
    if (testCase.skip) {
      it.skip(testCaseName, () => {});
      continue;
    }

    it(testCaseName, async () => {
      await executeTestCase(testCase);
    });
  }
});
