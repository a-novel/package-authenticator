import { useAccessToken, useAuthForm, useSession } from "../../../contexts";
import { AuthNavDesktopAction, AuthNavMobileAction } from "../../display/nav";
import type { AuthNavDisplayProps } from "../../display/nav/common";

import { GetUser } from "@a-novel/connector-authentication/hooks";
import { type NavBarProps, type CountryType, NavBar } from "@a-novel/neon-ui";

import { useMemo } from "react";

export interface AuthNavProps<Langs extends Record<string, CountryType>> extends NavBarProps<Langs> {
  manageAccount: () => void;
}

export const AuthNav = <Langs extends Record<string, CountryType>>({
  manageAccount,
  desktopActions,
  mobileActions,
  ...props
}: AuthNavProps<Langs>) => {
  const { selectForm } = useAuthForm();

  const { session, setSession } = useSession();
  const accessToken = useAccessToken();
  const authenticated = !!session?.claims?.userID;

  const userQuery = GetUser.useAPI(accessToken, { userID: session?.claims?.userID ?? "" });

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

  return (
    <NavBar
      desktopActions={
        <>
          {desktopActions}
          <AuthNavDesktopAction
            user={user}
            login={() => selectForm("login")}
            register={() => selectForm("register")}
            logout={() => setSession(undefined)}
            manageAccount={manageAccount}
          />
        </>
      }
      mobileActions={
        <>
          {mobileActions}
          <AuthNavMobileAction
            user={user}
            login={() => selectForm("login")}
            register={() => selectForm("register")}
            logout={() => setSession(undefined)}
            manageAccount={manageAccount}
          />
        </>
      }
      {...props}
    />
  );
};
