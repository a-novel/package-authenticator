import { ContainerSX, FONTS, SPACINGS } from "@a-novel/neon-ui";
import { InfoBox, MaterialSymbol } from "@a-novel/neon-ui/ui";

import type { FC, ReactNode } from "react";

import { Button, Stack, type StackProps, Typography } from "@mui/material";
import type { ReactFormExtendedApi } from "@tanstack/react-form";

export const FORM_WIDTH = "64ch";

export interface SuccessMessageProps {
  icon: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export const SuccessMessage: FC<SuccessMessageProps> = ({ icon, children, footer }) => (
  <Stack
    alignItems="stretch"
    direction="column"
    gap={SPACINGS.LARGE}
    padding={SPACINGS.SMALL}
    width={FORM_WIDTH}
    maxWidth="100vw"
    boxSizing="border-box"
  >
    <InfoBox icon={icon} color="success">
      {children}
    </InfoBox>

    {footer}
  </Stack>
);

export interface PopupFormProps {
  title: ReactNode;
  children: ReactNode;
  submitButton: ReactNode;
  footer?: ReactNode;
  form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any>;
}

export const PopupForm: FC<PopupFormProps> = ({ children, title, form, submitButton, footer }) => (
  <Stack
    alignItems="stretch"
    direction="column"
    width={FORM_WIDTH}
    gap={SPACINGS.LARGE}
    padding={SPACINGS.MEDIUM}
    boxSizing="border-box"
    maxWidth="100vw"
  >
    <Stack
      alignItems="stretch"
      direction="column"
      gap={SPACINGS.LARGE}
      maxWidth="100vw"
      sx={(theme) => ({
        [`@media (max-width: ${FORM_WIDTH})`]: {
          padding: 0,
        },
        [`@media (min-width: ${FORM_WIDTH})`]: {
          padding: SPACINGS.LARGE,
          borderRadius: SPACINGS.MEDIUM,
          ...(typeof ContainerSX === "function" ? ContainerSX(theme) : {}),
        },
      })}
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

      <Stack
        component="form"
        direction="column"
        spacing={SPACINGS.MEDIUM}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit().catch(console.error);
        }}
      >
        {children}

        <div style={{ height: SPACINGS.MEDIUM }} />

        <Button color="primary" variant="gradient-glow" type="submit" disabled={form.state.isSubmitting}>
          {submitButton}
        </Button>
      </Stack>

      {footer}
    </Stack>
    {form.state.errorMap.onSubmit && (
      <InfoBox icon={<MaterialSymbol icon="heart_broken" />} color="error">
        {form.state.errorMap.onSubmit}
      </InfoBox>
    )}
  </Stack>
);

export const PopupFormFooter: FC<StackProps> = ({ children, ...props }) => (
  <Stack direction="row" justifyContent="center" gap={SPACINGS.SMALL} boxSizing="border-box" {...props}>
    {children}
  </Stack>
);
