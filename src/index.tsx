import { AuthFormProvider, SessionProvider as BaseSessionProvider, SessionSuspense } from "./contexts";

import { type ComponentType, type ReactNode, useState } from "react";

export interface SessionProviderProps {
  layout?: ComponentType<{ children: ReactNode }>;
  useOverrideRouteMetaTitle: (title: string | undefined) => void;
  useOverrideRouteMetaDescription: (description: string | undefined) => void;
}

export function DefaultSessionProvider({
  layout,
  useOverrideRouteMetaTitle,
  useOverrideRouteMetaDescription,
}: SessionProviderProps) {
  return function SessionProvider({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState<string>();
    useOverrideRouteMetaTitle(title);
    const [description, setDescription] = useState<string>();
    useOverrideRouteMetaDescription(description);

    return (
      <BaseSessionProvider>
        <SessionSuspense>
          <AuthFormProvider setTitle={setTitle} setDescription={setDescription} layout={layout}>
            {children}
          </AuthFormProvider>
        </SessionSuspense>
      </BaseSessionProvider>
    );
  };
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
