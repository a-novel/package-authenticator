import { AuthNav, type AuthNavProps } from "./components/logical/nav";
import { AuthFormProvider, SessionProvider, SessionSuspense, SyncI18n, SyncSessionClaims } from "./contexts";

import { init as initAuthAPI } from "@a-novel/connector-authentication";
import type { CountryType } from "@a-novel/neon-ui";

import type { ElementType, ReactNode } from "react";

import type { ButtonTypeMap } from "@mui/material";

export interface InitProps {
  authURL: string;
}

export const init = (props: InitProps) => {
  // Initialize the base URL for the API
  initAuthAPI({ baseURL: props.authURL });
};

export interface WithSessionProps<
  Langs extends Record<string, CountryType> = Record<string, CountryType>,
  LoginButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  RegisterButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LogoutButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  ManageAccountButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
> {
  children: ReactNode;
  navProps: AuthNavProps<Langs, LoginButtonProps, RegisterButtonProps, LogoutButtonProps, ManageAccountButtonProps>;
  setTitle?: (title: string | undefined) => void;
}

export const WithSession = <Langs extends Record<string, CountryType>>({
  children,
  setTitle,
  navProps,
}: WithSessionProps<Langs>) => (
  <SessionProvider>
    <SyncI18n />
    <SyncSessionClaims />
    <SessionSuspense>
      <AuthFormProvider
        setTitle={setTitle}
        layout={({ children }) => (
          <>
            <AuthNav {...navProps} />
            {children}
          </>
        )}
      >
        {children}
      </AuthFormProvider>
    </SessionSuspense>
  </SessionProvider>
);

export { SessionPrivateSuspense } from "./contexts";
