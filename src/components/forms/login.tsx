import { PopupForm, PopupFormFooter } from "./common";

import { BINDINGS_VALIDATION, LoginForm as LoginRequest } from "@a-novel/connector-authentication/api";
import { type AnyReactFormWithData, EmailInput, PasswordInput } from "@a-novel/package-ui/tanstack/form";
import { WithTolgeeNs } from "@a-novel/package-ui/translations";

import { type MouseEventHandler } from "react";

import { Button, Typography } from "@mui/material";
import { useStore } from "@tanstack/react-form";
import { T, useTranslate } from "@tolgee/react";
import { z } from "zod";

export interface LoginFormConnector {
  form: AnyReactFormWithData<z.infer<typeof LoginRequest>>;
  resetPasswordAction: MouseEventHandler<HTMLButtonElement>;
  registerAction: MouseEventHandler<HTMLButtonElement>;
}

export interface LoginFormProps {
  connector: LoginFormConnector;
}

function InnerLoginForm({ connector }: LoginFormProps) {
  const { t } = useTranslate("form");

  const isSubmitting = useStore(connector.form.store, (state) => state.isSubmitting);

  return (
    <PopupForm
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
}

export const LoginForm = WithTolgeeNs(InnerLoginForm, ["authenticator.login", "form"]);
