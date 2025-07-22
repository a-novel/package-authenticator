import type { AuthFormContextType, SessionContextType } from "~/contexts";

import type { AuthNavDisplayProps } from "./common";
import { AuthNavDesktopAction } from "./desktop";
import { AuthNavMobileAction } from "./mobile";

import { NavBar, type NavBarProps } from "@a-novel/package-ui/mui/components";

import type { ElementType } from "react";

import type { ButtonProps, ButtonTypeMap } from "@mui/material";

export interface AuthNavConnector {
  user: AuthNavDisplayProps["user"];
  context: AuthFormContextType;
  sessionContext: SessionContextType;
}

export interface AuthNavProps<
  Langs extends readonly string[] = readonly string[],
  HomeButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  ManageAccountButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
> extends NavBarProps<Langs, HomeButtonProps> {
  login?: Omit<ButtonProps<"button">, "children" | "variant" | "color" | "sx" | "onClick" | "component">;
  register?: Omit<ButtonProps<"button">, "children" | "variant" | "color" | "sx" | "onClick" | "component">;
  logout?: Omit<ButtonProps<"button">, "children" | "variant" | "color" | "sx" | "onClick" | "component">;
  account: Omit<ButtonProps<ManageAccountButtonProps>, "children" | "variant" | "color" | "sx">;
  connector: AuthNavConnector;
}

export function AuthNav<
  Langs extends readonly string[] = readonly string[],
  HomeButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  ManageAccountButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
>({
  login,
  register,
  logout,
  account,
  connector,
  desktopActions,
  mobileActions,
  ...props
}: AuthNavProps<Langs, HomeButtonProps, ManageAccountButtonProps>) {
  return (
    <NavBar
      desktopActions={
        <>
          {desktopActions}
          <AuthNavDesktopAction
            user={connector.user}
            login={{ onClick: () => connector.context.selectForm("login"), ...login }}
            register={{ onClick: () => connector.context.selectForm("register"), ...register }}
            logout={{ onClick: () => connector.sessionContext.setSession(undefined), ...logout }}
            account={account}
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
            account={account}
          />
        </>
      }
      {...props}
    />
  );
}
