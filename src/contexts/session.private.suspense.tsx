import { useAuthForm } from "./auth.form";
import { useSession } from "./session";

import { type FC, type ReactNode, useEffect } from "react";

export interface SessionPrivateSuspenseProps {
  children?: ReactNode;
}

export const SessionPrivateSuspense: FC<SessionPrivateSuspenseProps> = ({ children }) => {
  const { session, synced } = useSession();
  const { selectForm } = useAuthForm();

  const authenticated = session?.claims?.userID;

  useEffect(() => {
    if (!synced) return;
    selectForm(authenticated ? undefined : "login");
  }, [synced, authenticated, selectForm]);

  // No flashing of the login form during SSR.
  if (!synced || !authenticated) {
    return null;
  }

  return <>{children}</>;
};
