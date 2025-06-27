import { i18nPKG } from "~/shared/i18n";

import { PopupForm, PopupFormFooter } from "./common";

import { BINDINGS_VALIDATION, LoginForm as LoginRequest } from "@a-novel/connector-authentication/api";
import { EmailInput, PasswordInput } from "@a-novel/neon-ui/ux";

import { type MouseEventHandler } from "react";

import { Button, Typography } from "@mui/material";
import {
  type FormAsyncValidateOrFn,
  type FormValidateOrFn,
  type ReactFormExtendedApi,
  useStore,
} from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export interface LoginFormConnector<
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginRequest>>,
  TSubmitMeta,
> {
  form: ReactFormExtendedApi<
    z.infer<typeof LoginRequest>,
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
  resetPasswordAction: MouseEventHandler<HTMLButtonElement>;
  registerAction: MouseEventHandler<HTMLButtonElement>;
}

export interface LoginFormProps<
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginRequest>>,
  TSubmitMeta,
> {
  connector: LoginFormConnector<
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

export const LoginForm = <
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginRequest>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof LoginRequest>>,
  TSubmitMeta,
>({
  connector,
}: LoginFormProps<
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
  const { t } = useTranslation(["authenticator.login", "form"], { i18n: i18nPKG });

  const isSubmitting = useStore(connector.form.store, (state) => state.isSubmitting);

  return (
    <PopupForm
      title={t("authenticator.login:title")}
      form={connector.form}
      submitButton={isSubmitting ? t("authenticator.login:form.submitting") : t("authenticator.login:form.submit")}
      footer={
        <PopupFormFooter>
          <Typography textAlign="center">
            <span>{t("authenticator.login:form.register.label")} </span>
            <Button variant="text" type="button" color="primary" onClick={connector.registerAction}>
              {t("authenticator.login:form.register.action")}
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
            maxLength={BINDINGS_VALIDATION.EMAIL.MAX}
          />
        )}
      </connector.form.Field>
      <connector.form.Field name="password">
        {(field) => (
          <PasswordInput
            field={field}
            label={t("form:fields.password.label")}
            helperText={
              <>
                {t("authenticator.login:fields.password.helper.text")}
                <Button variant="text" type="button" color="primary" onClick={connector.resetPasswordAction}>
                  {t("authenticator.login:fields.password.helper.action")}
                </Button>
              </>
            }
            maxLength={BINDINGS_VALIDATION.PASSWORD.MAX}
          />
        )}
      </connector.form.Field>
    </PopupForm>
  );
};
