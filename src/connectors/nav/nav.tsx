import { type AuthNavConnector } from "~/components/nav";
import type { AuthNavDisplayProps } from "~/components/nav/common";
import { useAccessToken, useAuthForm, useSession } from "~/contexts";

import { GetUser } from "@a-novel/connector-authentication/hooks";

import { useMemo } from "react";

export function useAuthNavConnector(): AuthNavConnector {
  const authForm = useAuthForm();

  const sessionContext = useSession();
  const accessToken = useAccessToken();
  const authenticated = !!sessionContext.session?.claims?.userID;

  const userQuery = GetUser.useAPI(accessToken, { userID: sessionContext.session?.claims?.userID ?? "" });

  const user = useMemo<AuthNavDisplayProps["user"]>(
    () =>
      authenticated
        ? {
            data: userQuery.data,
            loading: userQuery.isLoading,
            error: userQuery.isError,
          }
        : undefined,
    [authenticated, userQuery.data, userQuery.isError, userQuery.isLoading]
  );

  return {
    user,
    context: authForm,
    sessionContext,
  };
}
