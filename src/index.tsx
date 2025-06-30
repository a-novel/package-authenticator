import { AuthFormProvider, SessionProvider, SessionSuspense } from "./contexts";

import type { ComponentType, ReactNode } from "react";

export { init, type InitProps } from "./shared";

export interface WithSessionProps {
  children: ReactNode;
  layout?: ComponentType<{ children: ReactNode }>;
  setTitle?: (title: string | undefined) => void;
}

export const WithSession = ({ children, layout, setTitle }: WithSessionProps) => (
  <SessionProvider>
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
