import { AuthNav, type AuthNavProps } from "~/components/nav";
import { useAuthNavConnector } from "~/connectors/nav";

import { AuthFormProvider, SessionProvider as BaseSessionProvider, SessionSuspense } from "./contexts";

import { useTagManager } from "@a-novel/package-ui/tanstack/start";

import { type ComponentType, type ElementType, type ReactNode, useState } from "react";

import type { ButtonTypeMap } from "@mui/material";

export interface SessionProviderProps {
  children: ReactNode;
  layout?: ComponentType<{ children: ReactNode }>;
}

export function SessionProvider({ children, layout }: SessionProviderProps) {
  const [title, setTitle] = useState<string>();
  useTagManager({ tag: "title", children: title ?? "" }, title != null);

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

export function DefaultSessionLayout<
  Langs extends readonly string[] = readonly string[],
  HomeButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  ManageAccountButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
>(preset: Omit<AuthNavProps<Langs, HomeButtonProps, ManageAccountButtonProps>, "connector">) {
  return function SessionLayout({ children }: { children: ReactNode }) {
    return (
      <>
        <AuthNav connector={useAuthNavConnector()} {...preset} />
        {children}
      </>
    );
  };
}

export {
  SessionPrivateSuspense,
  SessionContext,
  useSession,
  useAccessToken,
  SESSION_STORAGE_KEY,
  SessionSync,
} from "./contexts";

export { AuthNav, type AuthNavProps } from "~/components/nav";
export { useAuthNavConnector } from "~/connectors/nav";
