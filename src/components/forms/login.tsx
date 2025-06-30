import { useTolgeeNamespaces } from "~/shared";

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
import { T, useTranslate } from "@tolgee/react";
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

const ns = ["authenticator.login", "form"];

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
  const { t } = useTranslate("form");
  useTolgeeNamespaces(ns);

  const isSubmitting = useStore(connector.form.store, (state) => state.isSubmitting);

  return (
    <PopupForm
      title={<T keyName="title" ns="authenticator.login" />}
      form={connector.form}
      submitButton={<T keyName={isSubmitting ? "form.submitting" : "form.submit"} ns="authenticator.login" />}
      footer={
        <PopupFormFooter>
          <Typography textAlign="center">
            <span>
              <T keyName="form.register.label" ns="authenticator.login" />{" "}
            </span>
            <Button variant="text" type="button" color="primary" onClick={connector.registerAction}>
              <T keyName="form.register.action" ns="authenticator.login" />
            </Button>
          </Typography>
        </PopupFormFooter>
      }
    >
      <connector.form.Field name="email">
        {(field) => (
          <EmailInput
            field={field}
            label={<T keyName="fields.email.label" ns="form" />}
            placeholder={t("fields.email.placeholder", { ns: "form" })}
            maxLength={BINDINGS_VALIDATION.EMAIL.MAX}
          />
        )}
      </connector.form.Field>
      <connector.form.Field name="password">
        {(field) => (
          <PasswordInput
            field={field}
            label={<T keyName="fields.password.label" ns="form" />}
            helperText={
              <>
                <T keyName="fields.password.helper.text" ns="authenticator.login" />
                <Button variant="text" type="button" color="primary" onClick={connector.resetPasswordAction}>
                  <T keyName="fields.password.helper.action" ns="authenticator.login" />
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
