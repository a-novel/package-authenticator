import { MockQueryClient } from "#/mocks/query_client";
import { genericSetup } from "#/utils/setup";
import { QueryWrapper } from "#/utils/wrapper";

import { SESSION_STORAGE_KEY, SessionProvider } from "./session";
import { SyncSessionClaims } from "./session.claims.sync.api";
import { TestSessionRenderer } from "./session.test";

import { ClaimsRoleEnum } from "@a-novel/connector-authentication/api";

import { QueryClient } from "@tanstack/react-query";
import { render, waitFor } from "@testing-library/react";
import nock from "nock";
import { describe, it, expect } from "vitest";

let nockAPI: nock.Scope;

describe("sync session claims", () => {
  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("leaves the claims untouched when not authenticated", async () => {
    const queryClient = new QueryClient(MockQueryClient);

    const screen = render(
      <SessionProvider>
        <SyncSessionClaims />
        <TestSessionRenderer />
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(() => {
      const session = screen.getByTestId("session");
      expect(session.innerHTML).toBe("");
    });
  });

  it("refetches claims on token change", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ accessToken: "access-token" }));

    const queryClient = new QueryClient(MockQueryClient);

    const nockClaims = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: [ClaimsRoleEnum.User],
      });

    const screen = render(
      <SessionProvider>
        <SyncSessionClaims />
        <TestSessionRenderer />
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(
      () => {
        nockClaims.done();
      },
      { timeout: 3000 }
    );

    await waitFor(() => {
      const session = screen.getByTestId("session");
      expect(JSON.parse(session.innerHTML)?.claims).toStrictEqual({
        userID: "00000000-0000-0000-0000-000000000001",
        roles: [ClaimsRoleEnum.User],
      });
    });

    // Update claims.
    const nockClaims2 = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer new-access-token" } })
      .reply(200, { userID: "00000000-0000-0000-0000-000000000002", roles: [ClaimsRoleEnum.Admin] });

    screen.rerender(
      <SessionProvider>
        <SyncSessionClaims />
        <TestSessionRenderer session={{ accessToken: "new-access-token" }} />
      </SessionProvider>
    );

    await waitFor(() => {
      nockClaims2.done();
    });

    await waitFor(() => {
      const session = screen.getByTestId("session");
      expect(JSON.parse(session.innerHTML)?.claims).toStrictEqual({
        userID: "00000000-0000-0000-0000-000000000002",
        roles: [ClaimsRoleEnum.Admin],
      });
    });
  });

  it("doesn't override manual changes", async () => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ accessToken: "access-token" }));

    const queryClient = new QueryClient(MockQueryClient);

    const nockClaims = nockAPI
      .get("/session", undefined, { reqheaders: { Authorization: "Bearer access-token" } })
      .reply(200, {
        userID: "00000000-0000-0000-0000-000000000001",
        roles: [ClaimsRoleEnum.User],
      });

    const screen = render(
      <SessionProvider>
        <SyncSessionClaims />
        <TestSessionRenderer />
      </SessionProvider>,
      { wrapper: QueryWrapper(queryClient) }
    );

    await waitFor(() => {
      nockClaims.done();
    });

    await waitFor(() => {
      const session = screen.getByTestId("session");
      expect(JSON.parse(session.innerHTML)?.claims).toStrictEqual({
        userID: "00000000-0000-0000-0000-000000000001",
        roles: [ClaimsRoleEnum.User],
      });
    });

    // Update claims manually.
    screen.rerender(
      <SessionProvider>
        <SyncSessionClaims />
        <TestSessionRenderer
          session={{
            accessToken: "access-token",
            claims: { userID: "00000000-0000-0000-0000-000000000002", roles: [ClaimsRoleEnum.Admin] },
          }}
        />
      </SessionProvider>
    );

    await waitFor(() => {
      const session = screen.getByTestId("session");
      expect(JSON.parse(session.innerHTML)?.claims).toStrictEqual({
        userID: "00000000-0000-0000-0000-000000000002",
        roles: [ClaimsRoleEnum.Admin],
      });
    });
  });
});
