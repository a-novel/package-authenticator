import { Section } from "@a-novel/package-ui/mui/components";
import { SPACINGS } from "@a-novel/package-ui/mui/utils";
import { type AnyReactFormWithData, TanstackFormWrapper } from "@a-novel/package-ui/tanstack/form";

import type { ReactNode } from "react";

import { Stack, type StackProps } from "@mui/material";

export interface PopupFormProps {
  children: ReactNode;
  submitButton: ReactNode;
  footer?: ReactNode;
  form: AnyReactFormWithData<any>;
}

export function PopupForm({ children, form, submitButton, footer }: PopupFormProps) {
  return (
    <Section
      alignItems="stretch"
      direction="column"
      gap={SPACINGS.LARGE}
      padding={SPACINGS.MEDIUM}
      boxSizing="border-box"
      maxWidth="100vw"
    >
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
}

export function PopupFormFooter({ children, ...props }: StackProps) {
  return (
    <Stack direction="row" justifyContent="center" gap={SPACINGS.SMALL} boxSizing="border-box" {...props}>
      {children}
    </Stack>
  );
}
