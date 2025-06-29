import type { AuthNavDisplayProps } from "./common";

import { SPACINGS } from "@a-novel/neon-ui";
import { MaterialSymbol } from "@a-novel/neon-ui/ui";

import { type FC, useEffect } from "react";

import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { T, useTolgee } from "@tolgee/react";

const UserButton: FC<Pick<AuthNavDisplayProps, "user" | "account">> = ({ user, account }) => {
  if (!user?.data) {
    return (
      <Button
        variant="outlined"
        color="info"
        sx={{ display: "flex", flexDirection: "column", gap: 0, padding: 0 }}
        {...account}
      >
        <Skeleton variant="rectangular" width="15rem" height="3.6rem" />
      </Button>
    );
  }

  const [username, provider] = user.data.email.split("@");

  return (
    <Button
      variant="outlined"
      color="primary"
      sx={{ display: "flex", flexDirection: "column", gap: 0, padding: "0.4rem 0.8rem" }}
      {...account}
    >
      <Typography
        lineHeight="1.4em"
        color="primary"
        margin={0}
        textAlign="right"
        whiteSpace="nowrap"
        width="14rem"
        textOverflow="ellipsis"
        overflow="hidden"
      >
        {username.trim()}
      </Typography>
      <Typography
        textAlign="right"
        color="textSecondary"
        fontSize="0.8rem!important"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        width="14rem"
        margin={0}
      >
        @{provider.trim()}
      </Typography>
    </Button>
  );
};

export const AuthNavDesktopAction: FC<AuthNavDisplayProps> = ({ user, login, register, logout, account }) => {
  const { addActiveNs, removeActiveNs } = useTolgee();

  // Load / unload translations.
  useEffect(() => {
    addActiveNs(["authenticator.nav"]).catch(console.error);
    return () => removeActiveNs(["authenticator.nav"]);
  }, [addActiveNs, removeActiveNs]);

  if (!user) {
    return (
      <Stack flexDirection="row" alignItems="center" padding={0} gap={SPACINGS.MEDIUM}>
        <Button variant="contained" color="primary" {...login}>
          <Typography>
            <T keyName="action.login" ns="authenticator.nav" />
          </Typography>
        </Button>
        <Button variant="contained" color="success" {...register}>
          <Typography>
            <T keyName="action.register" ns="authenticator.nav" />
          </Typography>
        </Button>
      </Stack>
    );
  }

  return (
    <Stack flexDirection="row" alignItems="center" padding={0} gap={SPACINGS.MEDIUM}>
      <UserButton user={user} account={account} />
      <Button variant="contained" color="error" {...logout}>
        <MaterialSymbol icon="logout" style={{ fontSize: "1.2rem", width: "1rem" }} />
      </Button>
    </Stack>
  );
};
