import { useAccessToken, useAuthForm, useSession } from "../../../contexts";
import { AuthNavDesktopAction, AuthNavMobileAction } from "../../display/nav";

import { GetUser } from "@a-novel/connector-authentication/hooks";
import { type NavBarProps, type CountryType, NavBar } from "@a-novel/neon-ui";

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

  const userQuery = GetUser.useAPI(accessToken, { userID: session?.claims?.userID ?? "" });

  return (
    <NavBar
      desktopActions={
        <>
          {desktopActions}
          <AuthNavDesktopAction
            user={userQuery.data}
            userLoading={userQuery.isLoading}
            userError={userQuery.isError}
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
            user={userQuery.data}
            userLoading={userQuery.isLoading}
            userError={userQuery.isError}
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
