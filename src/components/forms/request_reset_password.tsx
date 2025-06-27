import { i18nPKG } from "~/shared/i18n";

import { PopupForm, PopupFormFooter } from "./common";

import {
  BINDINGS_VALIDATION,
  RequestPasswordResetForm as RequestPasswordResetRequest,
} from "@a-novel/connector-authentication/api";
import { SPACINGS } from "@a-novel/neon-ui";
import { MaterialSymbol, Modal } from "@a-novel/neon-ui/ui";
import { EmailInput } from "@a-novel/neon-ui/ux";

import { type MouseEventHandler } from "react";

import { Button, Stack, Typography } from "@mui/material";
import {
  type FormAsyncValidateOrFn,
  type FormValidateOrFn,
  type ReactFormExtendedApi,
  useStore,
} from "@tanstack/react-form";
import { Trans, useTranslation } from "react-i18next";
import { z } from "zod";

export interface RequestResetPasswordFormConnector<
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TSubmitMeta,
> {
  form: ReactFormExtendedApi<
    z.infer<typeof RequestPasswordResetRequest>,
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta
  >;
  loginAction: MouseEventHandler<HTMLButtonElement>;
}

export interface RequestResetPasswordFormProps<
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TSubmitMeta,
> {
  connector: RequestResetPasswordFormConnector<
    TOnMount,
    TOnChange,
    TOnChangeAsync,
    TOnBlur,
    TOnBlurAsync,
    TOnSubmit,
    TOnSubmitAsync,
    TOnServer,
    TSubmitMeta
  >;
}

export const RequestResetPasswordForm = <
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestPasswordResetRequest>>,
  TSubmitMeta,
>({
  connector,
}: RequestResetPasswordFormProps<
  TOnMount,
  TOnChange,
  TOnChangeAsync,
  TOnBlur,
  TOnBlurAsync,
  TOnSubmit,
  TOnSubmitAsync,
  TOnServer,
  TSubmitMeta
>) => {
  const { t } = useTranslation(["authenticator.resetPassword", "form"], { i18n: i18nPKG });

  const isSubmitting = useStore(connector.form.store, (state) => state.isSubmitting);
  const isSubmitSuccessful = useStore(connector.form.store, (state) => state.isSubmitSuccessful);
  const userEmail = useStore(connector.form.store, (state) => state.values.email);

  return (
    <>
      <PopupForm
        title={t("authenticator.resetPassword:title")}
        form={connector.form}
        submitButton={
          isSubmitting ? t("authenticator.resetPassword:form.submitting") : t("authenticator.resetPassword:form.submit")
        }
        footer={
          <PopupFormFooter>
            <Typography textAlign="center">
              <Button variant="text" type="button" color="primary" onClick={connector.loginAction}>
                {t("authenticator.resetPassword:form.backToLogin.action")}
              </Button>
            </Typography>
          </PopupFormFooter>
        }
      >
        <connector.form.Field name="email">
          {(field) => (
            <EmailInput
              field={field}
              label={t("form:fields.email.label")}
              placeholder={t("form:fields.email.placeholder")}
              helperText={t("authenticator.resetPassword:fields.email.helper")}
              maxLength={BINDINGS_VALIDATION.EMAIL.MAX}
            />
          )}
        </connector.form.Field>
      </PopupForm>

      <Modal
        title={t("authenticator.resetPassword:form.success.title")}
        icon={<MaterialSymbol icon="mark_email_read" />}
        open={isSubmitSuccessful}
      >
        <Typography sx={{ "> strong": { color: (theme) => theme.palette.primary.main } }}>
          <Trans i18nKey="authenticator.resetPassword:form.success.main" values={{ mail: userEmail }} />
        </Typography>
        <br />
        <Typography color="textSecondary">{t("authenticator.resetPassword:form.success.sub")}</Typography>
        <br />
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={SPACINGS.MEDIUM}>
          <Button type="button" color="primary" onClick={connector.loginAction}>
            {t("authenticator.resetPassword:form.backToLogin.action")}
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
