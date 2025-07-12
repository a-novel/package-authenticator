import { MockQueryClient } from "#/mocks/query_client";
import "#/mocks/tolgee";
import { genericSetup } from "#/utils/setup";
import { QueryWrapper } from "#/utils/wrapper";

import { SESSION_STORAGE_KEY, type SessionContextType, SessionProvider } from "./session";
import { SessionSuspense } from "./session.suspense";
import { MockSession } from "./session.test";

import { UnauthorizedError } from "@a-novel/connector-authentication/api";

import { QueryClient, useQuery } from "@tanstack/react-query";
import { render, renderHook, type RenderResult, waitFor } from "@testing-library/react";
import nock from "nock";
import { describe, expect, it } from "vitest";

let nockAPI: nock.Scope;

interface TestCase {
  initialStorageSession?: SessionContextType["session"];
  preAction?: (queryClient: QueryClient) => void | Promise<void>;
  expectAPICalls: Array<{
    name: string;
    nock: () => nock.Scope;
  }>;
  expectRender: string | RegExp;
  then?: (screen: RenderResult) => TestCase;
  skip?: boolean;
}

const executeTestCase = async (testCase: TestCase, screen?: RenderResult, queryClient?: QueryClient) => {
  if (testCase.initialStorageSession) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(testCase.initialStorageSession));
  }

  const apiCalls = testCase.expectAPICalls.map((call) => ({
    name: call.name,
    nock: call.nock(),
  }));

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
    apiCalls.forEach((call) => call.nock.done());
  });

  await waitFor(() => {
    expect((screen as RenderResult).queryByText(testCase.expectRender)).not.toBeNull();
  });

  if (testCase.then) {
    return executeTestCase(testCase.then(screen as RenderResult), screen, queryClient);
  }
};

describe("session suspense", async () => {
  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  const testCases: Record<string, TestCase> = {
    "loads a session initially, if none is present": {
      expectAPICalls: [
        {
          name: "login",
          nock: () =>
            nockAPI.put("/session/anon").reply(200, {
              accessToken: "access-token",
            }),
        },
        {
          name: "session",
          nock: () =>
            nockAPI
              .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
              .reply(200, { roles: ["auth:anon"] }),
        },
      ],
      expectRender: "Hello world!",
    },
    "does nothing, if an initial session is present": {
      initialStorageSession: MockSession,
      expectAPICalls: [
        {
          name: "session",
          nock: () =>
            nockAPI.get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } }).reply(200, {
              userID: "94b4d288-dbff-4eca-805a-f45311a34e15",
              roles: ["auth:anon"],
            }),
        },
      ],
      expectRender: "Hello world!",
    },
    "does nothing, if an initial anonymous session is present": {
      initialStorageSession: { accessToken: "access-token" },
      expectAPICalls: [
        {
          name: "session",
          nock: () =>
            nockAPI
              .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
              .reply(200, { roles: ["auth:anon"] }),
        },
      ],
      expectRender: "Hello world!",
    },
    "while unauthenticated, creates a new anonymous session on unauthorized error": {
      initialStorageSession: { accessToken: "access-token" },
      expectAPICalls: [
        {
          name: "session",
          nock: () =>
            nockAPI
              .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
              .reply(200, { roles: ["auth:anon"] }),
        },
      ],
      expectRender: "Hello world!",
      then: () => ({
        preAction: async (queryClient) => {
          // Trigger a 401 / unauthorized call.
          renderHook(
            () => {
              return useQuery({
                queryKey: ["test"],
                queryFn: async () => {
                  // Bypass the authentication delay.
                  await new Promise((resolve) => setTimeout(resolve, 500));
                  throw new UnauthorizedError("foo");
                },
              });
            },
            { wrapper: QueryWrapper(queryClient) }
          );
        },
        expectAPICalls: [
          {
            name: "login",
            nock: () => nockAPI.put("/session/anon").reply(200, { accessToken: "access-token" }),
          },
          {
            name: "new session",
            nock: () =>
              nockAPI
                .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
                .reply(200, { roles: ["auth:anon"] }),
          },
        ],
        expectRender: "Hello world!",
      }),
    },
    "while authenticated, refresh the token on unauthorized error": {
      initialStorageSession: MockSession,
      expectAPICalls: [
        {
          name: "session",
          nock: () =>
            nockAPI.get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } }).reply(200, {
              userID: "94b4d288-dbff-4eca-805a-f45311a34e15",
              roles: ["auth:anon"],
            }),
        },
      ],
      expectRender: "Hello world!",
      then: () => ({
        preAction: async (queryClient) => {
          // Trigger a 401 / unauthorized call.
          renderHook(
            () => {
              return useQuery({
                queryKey: ["test"],
                queryFn: async () => {
                  // Bypass the authentication delay.
                  await new Promise((resolve) => setTimeout(resolve, 500));
                  throw new UnauthorizedError("foo");
                },
              });
            },
            { wrapper: QueryWrapper(queryClient) }
          );
        },
        expectAPICalls: [
          {
            name: "login",
            nock: () =>
              nockAPI.patch("/session/refresh?accessToken=access-token&refreshToken=refresh-token").reply(200, {
                accessToken: "access-token",
              }),
          },
          {
            name: "new session",
            nock: () =>
              nockAPI.get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } }).reply(200, {
                userID: "94b4d288-dbff-4eca-805a-f45311a34e15",
                roles: ["auth:anon"],
              }),
          },
        ],
        expectRender: "Hello world!",
      }),
    },
    "while authenticated, if refresh token fails, fallback to anonymous session": {
      initialStorageSession: MockSession,
      expectAPICalls: [
        {
          name: "session",
          nock: () =>
            nockAPI.get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } }).reply(200, {
              userID: "94b4d288-dbff-4eca-805a-f45311a34e15",
              roles: ["auth:anon"],
            }),
        },
      ],
      expectRender: "Hello world!",
      then: () => ({
        preAction: (queryClient) => {
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
            { wrapper: QueryWrapper(queryClient) }
          );
        },
        expectAPICalls: [
          {
            name: "retry session",
            nock: () =>
              nockAPI
                .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
                .reply(200, { roles: ["auth:anon"] }),
          },
          {
            name: "login",
            nock: () =>
              nockAPI
                .patch("/session/refresh?accessToken=access-token&refreshToken=refresh-token")
                .reply(403, {})
                .put("/session/anon")
                .reply(200, { accessToken: "access-token" }),
          },
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
