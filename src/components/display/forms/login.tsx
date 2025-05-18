import { i18nPKG } from "../../../shared/i18n";
import { EmailInput, PasswordInput } from "../inputs";
import { PopupForm, PopupFormFooter } from "./common";

import { LoginForm as LoginRequest } from "@a-novel/connector-authentication/api";

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
  form,
  resetPasswordAction,
  registerAction,
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
  const { t } = useTranslation("login", { i18n: i18nPKG });

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

  return (
    <PopupForm
      title={t("login:title")}
      form={form}
      submitButton={isSubmitting ? t("login:form.submitting") : t("login:form.submit")}
      footer={
        <PopupFormFooter>
          <Typography textAlign="center">
            <span>{t("login:form.register.label")} </span>
            <Button variant="text" type="button" color="primary" onClick={registerAction}>
              {t("login:form.register.action")}
            </Button>
          </Typography>
        </PopupFormFooter>
      }
    >
      <form.Field name="email">
        {(field) => (
          <EmailInput
            field={field}
            label={t("login:fields.email.label")}
            placeholder={t("login:fields.email.placeholder")}
          />
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <PasswordInput
            field={field}
            label={t("login:fields.password.label")}
            helperText={
              <>
                {t("login:fields.password.helper.text")}
                <Button variant="text" type="button" color="primary" onClick={resetPasswordAction}>
                  {t("login:fields.password.helper.action")}
                </Button>
              </>
            }
          />
        )}
      </form.Field>
    </PopupForm>
  );
};
