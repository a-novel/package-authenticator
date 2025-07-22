import { AuthFormProvider, SessionProvider as BaseSessionProvider, SessionSuspense } from "./contexts";

import { useClientTag } from "@a-novel/package-ui/tanstack/start";

import { type ComponentType, type ReactNode, useMemo, useState } from "react";

export interface SessionProviderProps {
  children: ReactNode;
  layout?: ComponentType<{ children: ReactNode }>;
}

export function SessionProvider({ children, layout }: SessionProviderProps) {
  const [title, setTitle] = useState<string>();
  useClientTag(useMemo(() => (title ? { title } : undefined), [title]));

  return (
    <BaseSessionProvider>
      <SessionSuspense>
        <AuthFormProvider setTitle={setTitle} layout={layout}>
          {children}
        </AuthFormProvider>
      </SessionSuspense>
    </BaseSessionProvider>
  );
}

export {
  SessionPrivateSuspense,
  WithPrivateSession,
  SessionContext,
  useSession,
  useAccessToken,
  SESSION_STORAGE_KEY,
  SessionSync,
} from "./contexts";

export { AuthNav, type AuthNavProps } from "~/components/nav";
export { useAuthNavConnector } from "~/connectors/nav";
