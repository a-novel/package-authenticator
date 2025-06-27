import type { AuthFormContextType, SessionContextType } from "~/contexts";

import type { AuthNavDisplayProps } from "./common";
import { AuthNavDesktopAction } from "./desktop";
import { AuthNavMobileAction } from "./mobile";

import { type CountryType, NavBar, type NavBarProps } from "@a-novel/neon-ui/ui";

import type { ElementType } from "react";

import type { ButtonProps, ButtonTypeMap } from "@mui/material";

export interface AuthNavConnector {
  user: AuthNavDisplayProps["user"];
  context: AuthFormContextType;
  sessionContext: SessionContextType;
}

export interface AuthNavProps<
  Langs extends Record<string, CountryType> = Record<string, CountryType>,
  HomeButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LoginButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  RegisterButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LogoutButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  ManageAccountButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
> extends NavBarProps<Langs, HomeButtonProps> {
  login?: Omit<ButtonProps<LoginButtonProps>, "children" | "variant" | "color" | "sx" | "onClick" | "component">;
  register?: Omit<ButtonProps<RegisterButtonProps>, "children" | "variant" | "color" | "sx" | "onClick" | "component">;
  logout?: Omit<ButtonProps<LogoutButtonProps>, "children" | "variant" | "color" | "sx" | "onClick" | "component">;
  manageAccount: Omit<ButtonProps<ManageAccountButtonProps>, "children" | "variant" | "color" | "sx">;
  connector: AuthNavConnector;
}

export const AuthNav = <
  Langs extends Record<string, CountryType> = Record<string, CountryType>,
  HomeButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LoginButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  RegisterButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LogoutButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  ManageAccountButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
>({
  login,
  register,
  logout,
  manageAccount,
  connector,
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
>) => (
  <NavBar
    desktopActions={
      <>
        {desktopActions}
        <AuthNavDesktopAction
          user={connector.user}
          login={{ onClick: () => connector.context.selectForm("login"), ...login }}
          register={{ onClick: () => connector.context.selectForm("register"), ...register }}
          logout={{ onClick: () => connector.sessionContext.setSession(undefined), ...logout }}
          manageAccount={manageAccount}
        />
      </>
    }
    mobileActions={
      <>
        {mobileActions}
        <AuthNavMobileAction
          user={connector.user}
          login={{ onClick: () => connector.context.selectForm("login"), ...login }}
          register={{ onClick: () => connector.context.selectForm("register"), ...register }}
          logout={{ onClick: () => connector.sessionContext.setSession(undefined), ...logout }}
          manageAccount={manageAccount}
        />
      </>
    }
    {...props}
  />
);
