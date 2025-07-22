import type { AuthNavDisplayProps } from "./common";

import { SPACINGS } from "@a-novel/package-ui/mui/utils";
import { WithTolgeeNs } from "@a-novel/package-ui/translations";

import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { T } from "@tolgee/react";

function InnerAuthNavMobileAction({ user, login, register, logout, account }: AuthNavDisplayProps) {
  if (!user) {
    return (
      <Stack flexDirection="column" alignItems="stretch" padding={0} gap={SPACINGS.MEDIUM}>
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
    <Stack flexDirection="column" alignItems="stretch" padding={0} gap={SPACINGS.MEDIUM}>
      <UserInfo user={user} />
      <span />
      <Button variant="outlined" color="primary" {...account}>
        <Typography>
          <T keyName="action.account" ns="authenticator.nav" />
        </Typography>
      </Button>
      <Button variant="contained" color="error" {...logout}>
        <Typography>
          <T keyName="action.logout" ns="authenticator.nav" />
        </Typography>
      </Button>
    </Stack>
  );
}

function UserInfo({ user }: Pick<AuthNavDisplayProps, "user">) {
  if (user?.data) {
    return (
      <Typography
        color="textSecondary"
        whiteSpace="break-spaces"
        textAlign="center"
        sx={(theme) => ({
          wordBreak: "break-all",
          "> strong": {
            color: theme.palette.text.primary,
          },
        })}
      >
        <T keyName="userInfo.connectedAs" ns="authenticator.nav" params={{ user: user.data.email }} />
      </Typography>
    );
  }

  if (user?.error) {
    return (
      <Typography color="error" textAlign="center">
        <T keyName="userInfo.error" ns="authenticator.nav" />
      </Typography>
    );
  }

  return (
    <>
      <Skeleton variant="rounded" width="100%" height="1rem" />
      <Skeleton variant="rounded" width="100%" height="1rem" />
    </>
  );
}

export const AuthNavMobileAction = WithTolgeeNs(InnerAuthNavMobileAction, ["authenticator.nav"]);
