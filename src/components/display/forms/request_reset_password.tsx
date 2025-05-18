import { i18nPKG } from "../../../shared/i18n";
import { EmailInput } from "../inputs";
import { PopupForm, PopupFormFooter, SuccessMessage } from "./common";

import { RequestPasswordResetForm as RequestPasswordResetRequest } from "@a-novel/connector-authentication/api";
import { MaterialSymbol } from "@a-novel/neon-ui";

import { type MouseEventHandler } from "react";

import { Button, Typography } from "@mui/material";
import {
  type FormAsyncValidateOrFn,
  type FormValidateOrFn,
  type ReactFormExtendedApi,
  useStore,
} from "@tanstack/react-form";
import { Trans, useTranslation } from "react-i18next";
import { z } from "zod";

export interface ResetPasswordFormProps<
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
  form,
  loginAction,
}: ResetPasswordFormProps<
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
  const { t } = useTranslation("resetPassword", { i18n: i18nPKG });

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  const isSubmitSuccessful = useStore(form.store, (state) => state.isSubmitSuccessful);

  if (isSubmitSuccessful) {
    return (
      <SuccessMessage
        icon={<MaterialSymbol icon="mark_email_read" />}
        footer={
          <Button variant="text" type="button" color="primary" onClick={loginAction}>
            {t("resetPassword:form.backToLogin.action")}
          </Button>
        }
      >
        <Typography variant="h6">{t("resetPassword:success.title")}</Typography>
        <Typography>
          <Trans
            i18n={i18nPKG}
            ns="resetPassword"
            i18nKey="resetPassword:success.content"
            values={{ mail: form.state.values.email }}
          />
          <br />
          <br />
          <i>{t("resetPassword:success.signature")}</i>
        </Typography>
      </SuccessMessage>
    );
  }

  return (
    <PopupForm
      title={t("resetPassword:title")}
      form={form}
      submitButton={isSubmitting ? t("resetPassword:form.submitting") : t("resetPassword:form.submit")}
      footer={
        <PopupFormFooter>
          <Typography textAlign="center">
            <Button variant="text" type="button" color="primary" onClick={loginAction}>
              {t("resetPassword:form.backToLogin.action")}
            </Button>
          </Typography>
        </PopupFormFooter>
      }
    >
      <form.Field name="email">
        {(field) => (
          <EmailInput
            field={field}
            label={t("resetPassword:fields.email.label")}
            placeholder={t("resetPassword:fields.email.placeholder")}
          />
        )}
      </form.Field>
    </PopupForm>
  );
};
