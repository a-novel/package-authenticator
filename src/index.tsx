import { AuthFormProvider, SessionProvider, SessionSuspense, SyncSessionClaims } from "./contexts";

import { init as initAuthAPI } from "@a-novel/connector-authentication";

import type { ComponentType, ReactNode } from "react";

export interface InitProps {
  authURL: string;
}

export const init = (props: InitProps) => {
  // Initialize the base URL for the API
  initAuthAPI({ baseURL: props.authURL });
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

export { useAuthNavConnector } from "./connectors/nav";
export { AuthNav } from "./components/nav";

export { SessionPrivateSuspense, SessionContext, useSession, useAccessToken } from "./contexts";
