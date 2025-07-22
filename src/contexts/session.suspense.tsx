import { useAccessToken, useSession } from "./session";

import { isUnauthorizedError } from "@a-novel/connector-authentication/api";
import { CheckSession, CreateAnonymousSession, RefreshSession } from "@a-novel/connector-authentication/hooks";
import { MaterialSymbol, StatusPage } from "@a-novel/package-ui/mui/components";
import { useTolgeeNs } from "@a-novel/package-ui/translations";

import { type ReactNode, useCallback, useEffect, useRef } from "react";

import { Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { T } from "@tolgee/react";

export interface SessionSuspenseProps {
  children?: ReactNode;
}

// Prevent accidental consecutive attempts to refresh the session.
const LOGIN_BUFFERING_INTERVAL = 100;

/**
 * Hold the rendering of the children until a proper session is available. If no session is available locally,
 * a new anonymous session is created.
 *
 * The session status is refreshed on a regular basis, plus everytime a children node encounters a session
 * error (401). In such case, the session is refreshed and the children are re-rendered.
 */
export function SessionSuspense({ children }: SessionSuspenseProps) {
  const accessToken = useAccessToken();
  useTolgeeNs("authenticator.session");

  useSyncReactQuery();
  useAutoSession();
  useSyncSessionClaims();

  if (!accessToken) {
    return (
      <StatusPage color="primary" icon={<MaterialSymbol icon="rss_feed" />}>
        <Typography>
          <T keyName="status.loading" ns="authenticator.session" />
        </Typography>
      </StatusPage>
    );
  }

  return children;
}

/**
 * Sync claims when a new session is created, or when the session is refreshed.
 */
function useSyncSessionClaims() {
  const { synced, session, setSession } = useSession();
  const { data: claims, isFetched } = CheckSession.useAPI(session?.accessToken ?? "");

  // Sync session claims.
  useEffect(() => {
    if (synced && isFetched) {
      setSession((prevSession) => ({ ...prevSession, claims }));
    }
  }, [claims, isFetched, setSession, synced]);
}

/**
 * Returns a function to refresh the session of the user, depending on its state (anonymous or authenticated).
 * The refresh reference is stable and should not change between renders.
 */
function useRefreshSession() {
  const { session } = useSession();
  const refreshAnonymousSession = useRefreshAnonymousSession();
  const refreshSession = useRefreshAuthenticatedSession();

  const { mutate: doRefreshAnon } = refreshAnonymousSession;
  const { mutate: doRefresh } = refreshSession;

  const isAnonymousSession = !session?.claims?.userID;
  const lastSessionRefresh = useRef(0);

  // Trigger a session refresh, using a secure buffer to prevent concurrent updates.
  const updateSession = useCallback(async () => {
    const isLastUpdateOldEnough = Date.now() - lastSessionRefresh.current > LOGIN_BUFFERING_INTERVAL;
    if (!isLastUpdateOldEnough) return;

    // Save the timestamp for a new session refresh attempt.
    lastSessionRefresh.current = Date.now();

    // If the user is anonymous, just create a new session.
    if (isAnonymousSession) {
      await doRefreshAnon();
      return;
    }

    await doRefresh();
  }, [doRefreshAnon, doRefresh, isAnonymousSession]);

  return {
    refreshSession: updateSession,
  };
}

/**
 * Refresh the authenticated session of the user, and sync the new session with the context.
 * If the refresh fails, it will fall back to creating a new anonymous session.
 */
function useRefreshAuthenticatedSession() {
  const { session, setSession } = useSession();
  const { mutate: refreshAnonymousSession } = useRefreshAnonymousSession();
  const { mutateAsync: doRefreshSession } = RefreshSession.useAPI();

  const refresh = useCallback(async () => {
    await doRefreshSession({ accessToken: session?.accessToken ?? "", refreshToken: session?.refreshToken ?? "" })
      .then((result) => setSession({ accessToken: result.accessToken, refreshToken: session?.refreshToken ?? "" }))
      .catch(refreshAnonymousSession);
  }, [doRefreshSession, setSession, session?.accessToken, session?.refreshToken, refreshAnonymousSession]);

  return {
    mutate: refresh,
  };
}

/**
 * Fetch a new anonymous session, and sync the new session with the context.
 */
function useRefreshAnonymousSession() {
  const { setSession } = useSession();
  const { mutateAsync: doCreateAnonymousSession } = CreateAnonymousSession.useAPI();

  const refresh = useCallback(
    () =>
      doCreateAnonymousSession().then((result) => {
        setSession({ accessToken: result.accessToken });
      }),
    [doCreateAnonymousSession, setSession]
  );

  return {
    mutate: refresh,
  };
}

/**
 * Automatically trigger session refreshes when forbidden errors are encountered across the application.
 */
function useSyncReactQuery() {
  const queryClient = useQueryClient();

  const queryCache = useRef(queryClient.getQueryCache());
  const mutationCache = useRef(queryClient.getMutationCache());

  const refreshSessionHook = useRefreshSession();

  const refreshSession = useRef(refreshSessionHook.refreshSession);
  refreshSession.current = refreshSessionHook.refreshSession;

  const subscribeQueryCache = queryCache.current.subscribe;
  const subscribeMutationCache = mutationCache.current.subscribe;

  // Services should return a 401 status code to indicate missing / invalid checkSession. When this happens, we
  // trigger a new checkSession update.
  useEffect(() => {
    subscribeQueryCache((event) => {
      if (isUnauthorizedError(event.query.state.error)) refreshSession.current();
    });
  }, [subscribeQueryCache]);

  // Same logic as above but for mutations (react query has a separate cache for both).
  useEffect(() => {
    subscribeMutationCache((event) => {
      if (isUnauthorizedError(event.mutation?.state.error)) refreshSession.current();
    });
  }, [subscribeMutationCache]);
}

/**
 * Retrieve an anonymous session if no session is available.
 */
function useAutoSession() {
  const { synced, session } = useSession();
  const { mutate } = useRefreshAnonymousSession();

  // Don't try to fetch a new session if the last attempt failed.
  useEffect(() => {
    if (synced && !session?.accessToken) {
      mutate().then();
    }
  }, [synced, session?.accessToken, mutate]);
}
