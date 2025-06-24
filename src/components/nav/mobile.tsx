import { i18nPKG } from "../../shared/i18n";
import type { AuthNavDisplayProps } from "./common";

import { SPACINGS } from "@a-novel/neon-ui";

import type { FC } from "react";

import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

const UserInfo: FC<Pick<AuthNavDisplayProps, "user">> = ({ user }) => {
  const { t } = useTranslation("authenticator.nav", { i18n: i18nPKG });

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
        <Trans
          i18n={i18nPKG}
          i18nKey="authenticator.nav:userInfo.connectedAs"
          ns="authenticator.nav"
          values={{ user: user.data.email }}
        />
      </Typography>
    );
  }

  if (user?.error) {
    return (
      <Typography color="error" textAlign="center">
        {t("authenticator.nav:userInfo.error")}
      </Typography>
    );
  }

  return (
    <>
      <Skeleton variant="rounded" width="100%" height="1rem" />
      <Skeleton variant="rounded" width="100%" height="1rem" />
    </>
  );
};

export const AuthNavMobileAction: FC<AuthNavDisplayProps> = ({ user, login, register, logout, manageAccount }) => {
  const { t } = useTranslation("authenticator.nav", { i18n: i18nPKG });

  if (!user) {
    return (
      <Stack flexDirection="column" alignItems="stretch" padding={0} gap={SPACINGS.MEDIUM}>
        <Button variant="contained" color="primary" {...login}>
          <Typography>{t("authenticator.nav:action.login")}</Typography>
        </Button>
        <Button variant="contained" color="success" {...register}>
          <Typography>{t("authenticator.nav:action.register")}</Typography>
        </Button>
      </Stack>
    );
  }

  return (
    <Stack flexDirection="column" alignItems="stretch" padding={0} gap={SPACINGS.MEDIUM}>
      <UserInfo user={user} />
      <span />
      <Button variant="outlined" color="primary" {...manageAccount}>
        <Typography>{t("authenticator.nav:action.manageAccount")}</Typography>
      </Button>
      <Button variant="contained" color="error" {...logout}>
        <Typography>{t("authenticator.nav:action.logout")}</Typography>
      </Button>
    </Stack>
  );
};
