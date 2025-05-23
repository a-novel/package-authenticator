import { i18nPKG } from "../../../shared/i18n";
import { EmailInput } from "../inputs";
import { PopupForm, PopupFormFooter, SuccessMessage } from "./common";

import { RequestRegistrationForm as RequestRegistrationRequest } from "@a-novel/connector-authentication/api";
import { MaterialSymbol } from "@a-novel/neon-ui/ui";

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

export interface RegisterFormProps<
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TSubmitMeta,
> {
  form: ReactFormExtendedApi<
    z.infer<typeof RequestRegistrationRequest>,
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

export const RequestRegistrationForm = <
  TOnMount extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnChange extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnBlur extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnSubmit extends undefined | FormValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TOnServer extends undefined | FormAsyncValidateOrFn<z.infer<typeof RequestRegistrationRequest>>,
  TSubmitMeta,
>({
  form,
  loginAction,
}: RegisterFormProps<
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
  const { t } = useTranslation("register", { i18n: i18nPKG });

  const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
  const isSubmitSuccessful = useStore(form.store, (state) => state.isSubmitSuccessful);

  if (isSubmitSuccessful) {
    return (
      <SuccessMessage
        icon={<MaterialSymbol icon="mark_email_read" />}
        footer={
          <Button variant="text" type="button" color="primary" onClick={loginAction}>
            {t("register:form.toLogin.action")}
          </Button>
        }
      >
        <Typography variant="h6">{t("register:success.title")}</Typography>
        <Typography>
          <Trans
            i18n={i18nPKG}
            ns="register"
            i18nKey="register:success.content"
            values={{ mail: form.state.values.email }}
          />
          <br />
          <br />
          <i>{t("register:success.signature")}</i>
        </Typography>
      </SuccessMessage>
    );
  }

  return (
    <PopupForm
      title={t("register:title")}
      form={form}
      submitButton={isSubmitting ? t("register:form.submitting") : t("register:form.submit")}
      footer={
        <PopupFormFooter>
          <Typography textAlign="center">
            <span>{t("register:form.login.label")} </span>
            <Button variant="text" type="button" color="primary" onClick={loginAction}>
              {t("register:form.login.action")}
            </Button>
          </Typography>
        </PopupFormFooter>
      }
    >
      <form.Field name="email">
        {(field) => (
          <EmailInput
            field={field}
            label={t("register:fields.email.label")}
            placeholder={t("register:fields.email.placeholder")}
          />
        )}
      </form.Field>
    </PopupForm>
  );
};
