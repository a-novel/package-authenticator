import { AuthFormProvider, SessionProvider, SessionSuspense, SyncSessionClaims } from "./contexts";
import { i18nPKG } from "./shared/i18n";

import { init as initAuthAPI } from "@a-novel/connector-authentication";

import type { ComponentType, ReactNode } from "react";

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

export interface WithSessionProps {
  children: ReactNode;
  layout?: ComponentType<{ children: ReactNode }>;
  setTitle?: (title: string | undefined) => void;
}

export const WithSession = ({ children, layout, setTitle }: WithSessionProps) => (
  <SessionProvider>
    <SyncSessionClaims />
    <SessionSuspense>
      <AuthFormProvider setTitle={setTitle} layout={layout}>
        {children}
      </AuthFormProvider>
    </SessionSuspense>
  </SessionProvider>
);

export { useAuthNavConnector } from "./components/ux/nav";
export { AuthNav } from "./components/ui/nav";

export { SessionPrivateSuspense } from "./contexts";
