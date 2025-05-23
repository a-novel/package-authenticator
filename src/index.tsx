import { AuthNav, type AuthNavProps } from "./components/ux/nav";
import { AuthFormProvider, SessionProvider, SessionSuspense, SyncSessionClaims } from "./contexts";
import { i18nPKG } from "./shared/i18n";

import { init as initAuthAPI } from "@a-novel/connector-authentication";
import type { CountryType } from "@a-novel/neon-ui/ui";

import type { ElementType, ReactNode } from "react";

import type { ButtonTypeMap } from "@mui/material";
import { type i18n } from "i18next";

export interface InitProps {
  authURL: string;
  i18n?: i18n;
}

export const init = (props: InitProps) => {
  // Initialize the base URL for the API
  initAuthAPI({ baseURL: props.authURL });
  props.i18n?.on("languageChanged", (lang) => {
    i18nPKG.changeLanguage(lang).catch(console.error);
  });
};

export interface WithSessionProps<
  Langs extends Record<string, CountryType> = Record<string, CountryType>,
  HomeButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  ManageAccountButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LoginButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  RegisterButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LogoutButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
> {
  children: ReactNode;
  navProps: AuthNavProps<
    Langs,
    HomeButtonProps,
    LoginButtonProps,
    RegisterButtonProps,
    LogoutButtonProps,
    ManageAccountButtonProps
  >;
  setTitle?: (title: string | undefined) => void;
}

export const WithSession = <
  Langs extends Record<string, CountryType> = Record<string, CountryType>,
  HomeButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  ManageAccountButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LoginButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  RegisterButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LogoutButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
>({
  children,
  setTitle,
  navProps,
}: WithSessionProps<
  Langs,
  HomeButtonProps,
  ManageAccountButtonProps,
  LoginButtonProps,
  RegisterButtonProps,
  LogoutButtonProps
>) => (
  <SessionProvider>
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
