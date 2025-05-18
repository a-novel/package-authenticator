import { i18nPKG } from "../../../shared/i18n";
import type { AuthNavProps } from "./common";

import { SPACINGS } from "@a-novel/neon-ui";

import type { FC } from "react";

import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

const UserInfo: FC<Pick<AuthNavProps, "user" | "userError">> = ({ user, userError }) => {
  const { t } = useTranslation("nav", { i18n: i18nPKG });

  if (user) {
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
        <Trans i18n={i18nPKG} i18nKey="nav:userInfo.connectedAs" ns="nav" values={{ user: user.email }} />
      </Typography>
    );
  }

  if (userError) {
    return (
      <Typography color="error" textAlign="center">
        {t("nav:userInfo.error")}
      </Typography>
    );
  }

  return (
    <>
      <Skeleton variant="rectangular" width="100%" height="1rem" />
      <Skeleton variant="rectangular" width="100%" height="1rem" />
    </>
  );
};

export const AuthNavMobileAction: FC<AuthNavProps> = ({
  user,
  userLoading,
  userError,
  login,
  register,
  logout,
  manageAccount,
}) => {
  const { t } = useTranslation("nav", { i18n: i18nPKG });

  if (!user && !userLoading && !userError) {
    return (
      <Stack flexDirection="column" alignItems="stretch" padding={0} gap={SPACINGS.MEDIUM}>
        <Button variant="contained" color="primary" onClick={login}>
          <Typography>{t("nav:action.login")}</Typography>
        </Button>
        <Button variant="contained" color="success" onClick={register}>
          <Typography>{t("nav:action.register")}</Typography>
        </Button>
      </Stack>
    );
  }

  return (
    <Stack flexDirection="column" alignItems="stretch" padding={0} gap={SPACINGS.MEDIUM}>
      <UserInfo user={user} userError={userError} />
      <span />
      <Button variant="outlined" color="primary" onClick={manageAccount}>
        <Typography>{t("nav:action.manageAccount")}</Typography>
      </Button>
      <Button variant="contained" color="error" onClick={logout}>
        <Typography>{t("nav:action.logout")}</Typography>
      </Button>
    </Stack>
  );
};
