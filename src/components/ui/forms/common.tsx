import { FONTS, SPACINGS } from "@a-novel/neon-ui";
import { Section } from "@a-novel/neon-ui/ui";
import { TanstackFormWrapper } from "@a-novel/neon-ui/ux";

import type { FC, ReactNode } from "react";

import { Stack, type StackProps, Typography } from "@mui/material";
import type { ReactFormExtendedApi } from "@tanstack/react-form";

export interface PopupFormProps {
  title: ReactNode;
  children: ReactNode;
  submitButton: ReactNode;
  footer?: ReactNode;
  form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any>;
}

export const PopupForm: FC<PopupFormProps> = ({ children, title, form, submitButton, footer }) => (
  <Section
    alignItems="stretch"
    direction="column"
    gap={SPACINGS.LARGE}
    padding={SPACINGS.MEDIUM}
    boxSizing="border-box"
    maxWidth="100vw"
  >
    <Typography
      textAlign="center"
      fontFamily={FONTS.BUNGEE}
      variant="h2"
      component="h1"
      margin={0}
      padding={0}
      color="primary"
    >
      {title}
    </Typography>

    <TanstackFormWrapper
      form={form}
      submitButton={submitButton}
      submitButtonProps={{ variant: "gradient-glow" }}
      footer={footer}
    >
      {children}
    </TanstackFormWrapper>
  </Section>
);

export const PopupFormFooter: FC<StackProps> = ({ children, ...props }) => (
  <Stack direction="row" justifyContent="center" gap={SPACINGS.SMALL} boxSizing="border-box" {...props}>
    {children}
  </Stack>
);
