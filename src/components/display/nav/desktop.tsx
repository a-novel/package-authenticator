import { i18nPKG } from "../../../shared/i18n";
import type { AuthNavDisplayProps } from "./common";

import { SPACINGS, MaterialSymbol } from "@a-novel/neon-ui";

import type { FC } from "react";

import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const UserButton: FC<Pick<AuthNavDisplayProps, "user" | "manageAccount">> = ({ user, manageAccount }) => {
  if (!user?.data) {
    return (
      <Button
        variant="outlined"
        color="info"
        onClick={manageAccount}
        sx={{ display: "flex", flexDirection: "column", gap: 0, padding: 0 }}
      >
        <Skeleton variant="rectangular" width="15rem" height="4rem" />
      </Button>
    );
  }

  const [username, provider] = user.data.email.split("@");

  return (
    <Button
      variant="outlined"
      onClick={manageAccount}
      sx={{ display: "flex", flexDirection: "column", gap: 0, padding: "0.4rem 0.8rem" }}
    >
      <Typography
        variant="h6"
        lineHeight="1.4em"
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
        variant="caption"
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

export const AuthNavDesktopAction: FC<AuthNavDisplayProps> = ({ user, login, register, logout, manageAccount }) => {
  const { t } = useTranslation("nav", { i18n: i18nPKG });

  if (!user) {
    return (
      <Stack flexDirection="row" alignItems="center" padding={0} gap={SPACINGS.MEDIUM}>
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
    <Stack flexDirection="row" alignItems="center" padding={0} gap={SPACINGS.MEDIUM}>
      <UserButton user={user} manageAccount={manageAccount} />
      <Button variant="contained" color="error" onClick={logout}>
        <MaterialSymbol icon="logout" style={{ fontSize: "1.2rem", width: "1rem" }} />
      </Button>
    </Stack>
  );
};
