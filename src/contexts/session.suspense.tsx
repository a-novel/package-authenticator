import { useAccessToken, useSession } from "./session";

import { isUnauthorizedError } from "@a-novel/connector-authentication/api";
import {
  CheckSession,
  CreateAnonymousSession,
  NewRefreshToken,
  RefreshSession,
} from "@a-novel/connector-authentication/hooks";
import { StatusPage, MaterialSymbol } from "@a-novel/neon-ui/ui";

import { type FC, type ReactNode, useCallback, useEffect, useRef } from "react";

import { Button, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { T, useTolgee } from "@tolgee/react";

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
export const SessionSuspense: FC<SessionSuspenseProps> = ({ children }) => {
  const { addActiveNs, removeActiveNs } = useTolgee();

  // Load / unload translations.
  useEffect(() => {
    addActiveNs(["authenticator.session"]).catch(console.error);
    return () => removeActiveNs(["authenticator.session"]);
  }, [addActiveNs, removeActiveNs]);

  const queryClient = useQueryClient();

  const { synced, setSession, session } = useSession();
  const accessToken = useAccessToken();
  const checkSession = CheckSession.useAPI(accessToken);
  const { mutate: doCreateAnonymousSession, ...createAnonymousSession } = CreateAnonymousSession.useAPI();
  const { mutateAsync: doGetRefreshToken } = NewRefreshToken.useAPI(accessToken);
  const { mutateAsync: doRefresh, ...refreshSession } = RefreshSession.useAPI();

  const isAnonymousSession = !session?.claims?.userID;
  const canRetry = !createAnonymousSession.isPending && !refreshSession.isPending;
  const lastSessionRefresh = useRef(0);

  // Perform login, unless a successful login happened during the buffering interval.
  const updateSession = useCallback(() => {
    // Retry is allowed if last attempt is old enough, or on error.
    const hasError = isAnonymousSession ? createAnonymousSession.isError : refreshSession.isError;
    if (!canRetry || (Date.now() - lastSessionRefresh.current < LOGIN_BUFFERING_INTERVAL && !hasError)) return;
    lastSessionRefresh.current = Date.now();

    // If user is anonymous, just create a new checkSession.
    if (isAnonymousSession) {
      doCreateAnonymousSession();
      return;
    }

    // If the user is authenticated, try getting a new token from the API. If this attempt fails, delete the current
    // checkSession and create a new one.
    doRefresh({ accessToken: session?.accessToken ?? "", refreshToken: session?.refreshToken ?? "" }).catch((err) => {
      console.error("Error while refreshing session", err);
      doCreateAnonymousSession();
    });
  }, [
    doCreateAnonymousSession,
    createAnonymousSession.isError,
    refreshSession.isError,
    doRefresh,
    canRetry,
    isAnonymousSession,
    session?.accessToken,
    session?.refreshToken,
  ]);

  // Use a ref because changes to this function must not retrigger logins.
  const updateSessionStable = useRef(updateSession);
  updateSessionStable.current = updateSession;

  const queryCache = useRef(queryClient.getQueryCache());
  const mutationCache = useRef(queryClient.getMutationCache());

  // Update session when login is performed.
  useEffect(() => {
    // Token has not changed, or login data does not contain a token, no need to update.
    const loginAccessToken = createAnonymousSession.data?.accessToken;

    if (loginAccessToken) {
      setSession((prevSession) => ({
        ...prevSession,
        accessToken: loginAccessToken,
      }));
    }
  }, [createAnonymousSession.data?.accessToken, setSession]);

  // Services should return a 401 status code to indicate missing / invalid checkSession. When this happens, we
  // trigger a new checkSession update.
  useEffect(() => {
    const callback: Parameters<(typeof queryCache.current)["subscribe"]>[0] = (event) => {
      if (isUnauthorizedError(event.query.state.error)) updateSessionStable.current();
    };
    queryCache.current.subscribe(callback);
  }, []);

  // Same logic as above but for mutations (react query has a separate cache for both).
  useEffect(() => {
    const callback: Parameters<(typeof mutationCache.current)["subscribe"]>[0] = (event) => {
      if (isUnauthorizedError(event.mutation?.state.error)) updateSessionStable.current();
    };
    mutationCache.current.subscribe(callback);
  }, []);

  // Login with an anonymous checkSession if no checkSession is available.
  useEffect(() => {
    if (synced && !session && !createAnonymousSession.isError && !createAnonymousSession.isPending) {
      updateSessionStable.current();
    }
  }, [session, createAnonymousSession.isError, createAnonymousSession.isPending, synced]);

  // When authenticating, try to get a refresh token.
  useEffect(() => {
    if (!isAnonymousSession && accessToken && synced && !session?.refreshToken) {
      doGetRefreshToken()
        .then((res) => {
          setSession((prevSession) => ({
            ...prevSession,
            refreshToken: res,
          }));
        })
        .catch((err) => {
          console.error("Error while getting refresh token", err);
        });
    }
  }, [synced, accessToken, doGetRefreshToken, isAnonymousSession, session?.refreshToken, setSession]);

  // Rendering.
  if (createAnonymousSession.isError || (!checkSession.isPending && checkSession.isError)) {
    return (
      <StatusPage
        icon={<MaterialSymbol icon="heart_broken" />}
        color="error"
        footer={
          <Button color="error" onClick={() => updateSession()}>
            <T keyName="actions.retry" ns="authenticator.session" />
          </Button>
        }
      >
        <Typography>
          <T keyName="status.error" ns="authenticator.session" />
        </Typography>
      </StatusPage>
    );
  }

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
};
