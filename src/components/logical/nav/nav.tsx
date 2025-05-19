import { useAccessToken, useAuthForm, useSession } from "../../../contexts";
import { AuthNavDesktopAction, AuthNavMobileAction } from "../../display/nav";
import type { AuthNavDisplayProps } from "../../display/nav/common";

import { GetUser } from "@a-novel/connector-authentication/hooks";
import { type NavBarProps, type CountryType, NavBar } from "@a-novel/neon-ui";

import { type ElementType, useMemo } from "react";

import type { ButtonProps, ButtonTypeMap } from "@mui/material";

export interface AuthNavProps<
  Langs extends Record<string, CountryType> = Record<string, CountryType>,
  HomeButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LoginButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  RegisterButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LogoutButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  ManageAccountButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
> extends NavBarProps<Langs, HomeButtonProps> {
  authNavProps: {
    login: Omit<ButtonProps<LoginButtonProps>, "children" | "variant" | "color" | "sx" | "onClick" | "component">;
    register: Omit<ButtonProps<RegisterButtonProps>, "children" | "variant" | "color" | "sx" | "onClick" | "component">;
    logout: Omit<ButtonProps<LogoutButtonProps>, "children" | "variant" | "color" | "sx" | "onClick" | "component">;
    manageAccount: Omit<ButtonProps<ManageAccountButtonProps>, "children" | "variant" | "color" | "sx">;
  };
}

export const AuthNav = <
  Langs extends Record<string, CountryType> = Record<string, CountryType>,
  HomeButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LoginButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  RegisterButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LogoutButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  ManageAccountButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
>({
  authNavProps,
  desktopActions,
  mobileActions,
  ...props
}: AuthNavProps<
  Langs,
  HomeButtonProps,
  LoginButtonProps,
  RegisterButtonProps,
  LogoutButtonProps,
  ManageAccountButtonProps
>) => {
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
            login={{ onClick: () => selectForm("login"), ...authNavProps.login }}
            register={{ onClick: () => selectForm("register"), ...authNavProps.register }}
            logout={{ onClick: () => setSession(undefined), ...authNavProps.logout }}
            manageAccount={authNavProps.manageAccount}
          />
        </>
      }
      mobileActions={
        <>
          {mobileActions}
          <AuthNavMobileAction
            user={user}
            login={{ onClick: () => selectForm("login"), ...authNavProps.login }}
            register={{ onClick: () => selectForm("register"), ...authNavProps.register }}
            logout={{ onClick: () => setSession(undefined), ...authNavProps.logout }}
            manageAccount={authNavProps.manageAccount}
          />
        </>
      }
      {...props}
    />
  );
};
