import { useAccessToken, useSession } from "./session";

import { CheckSession } from "@a-novel/connector-authentication/hooks";

import { type FC, useEffect } from "react";

/**
 * Update the context session when new claims are received from the API.
 */
export const SyncSessionClaims: FC = () => {
  const { setSession } = useSession();
  const accessToken = useAccessToken();
  const { data: claims, isSuccess } = CheckSession.useAPI(accessToken);

  // Update session when the claims are changed. An update will automatically be triggered by a new token, because
  // the token is part of the tanstack caching key.
  useEffect(() => {
    if (isSuccess) setSession((prevSession) => ({ ...prevSession, claims }));
  }, [setSession, claims, isSuccess]);

  return null;
};
