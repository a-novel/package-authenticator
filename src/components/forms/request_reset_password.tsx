import { PopupForm, PopupFormFooter } from "./common";

import {
  BINDINGS_VALIDATION,
  RequestPasswordResetForm as RequestPasswordResetRequest,
} from "@a-novel/connector-authentication/api";
import { MaterialSymbol, Modal } from "@a-novel/package-ui/mui/components";
import { SPACINGS } from "@a-novel/package-ui/mui/utils";
import { EmailInput } from "@a-novel/package-ui/tanstack/form";
import { WithTolgeeNs } from "@a-novel/package-ui/translations";

import { type MouseEventHandler } from "react";

import { Button, Stack, Typography } from "@mui/material";
import {
  type FormAsyncValidateOrFn,
  type FormValidateOrFn,
  type ReactFormExtendedApi,
  useStore,
} from "@tanstack/react-form";
import { T, useTranslate } from "@tolgee/react";
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

function InnerRequestResetPasswordForm<
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
>) {
  const { t } = useTranslate("form");

  const isSubmitting = useStore(connector.form.store, (state) => state.isSubmitting);
  const isSubmitSuccessful = useStore(connector.form.store, (state) => state.isSubmitSuccessful);
  const userEmail = useStore(connector.form.store, (state) => state.values.email);

  return (
    <>
      <PopupForm
        title={<T keyName="title" ns="authenticator.resetPassword" />}
        form={connector.form}
        submitButton={<T keyName={isSubmitting ? "form.submitting" : "form.submit"} ns="authenticator.resetPassword" />}
        footer={
          <PopupFormFooter>
            <Typography textAlign="center">
              <Button variant="text" type="button" color="primary" onClick={connector.loginAction}>
                <T keyName="form.backToLogin.action" ns="authenticator.resetPassword" />
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
              helperText={<T keyName="fields.email.helper" ns="authenticator.resetPassword" />}
              maxLength={BINDINGS_VALIDATION.EMAIL.MAX}
            />
          )}
        </connector.form.Field>
      </PopupForm>

      <Modal
        title={<T keyName="form.success.title" ns="authenticator.resetPassword" />}
        icon={<MaterialSymbol icon="mark_email_read" />}
        open={isSubmitSuccessful}
      >
        <Typography sx={{ "> strong": { color: (theme) => theme.palette.primary.main } }}>
          <T
            keyName="form.success.main"
            ns="authenticator.resetPassword"
            params={{ mail: userEmail, strong: <strong /> }}
          />
        </Typography>
        <br />
        <Typography color="textSecondary">
          <T keyName="form.success.sub" ns="authenticator.resetPassword" />
        </Typography>
        <br />
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={SPACINGS.MEDIUM}>
          <Button type="button" color="primary" onClick={connector.loginAction}>
            <T keyName="form.backToLogin.action" ns="authenticator.resetPassword" />
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export const RequestResetPasswordForm = WithTolgeeNs(InnerRequestResetPasswordForm, [
  "authenticator.resetPassword",
  "form",
]);
