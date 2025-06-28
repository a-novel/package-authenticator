import { PopupForm, PopupFormFooter } from "./common";

import {
  BINDINGS_VALIDATION,
  RequestRegistrationForm as RequestRegistrationRequest,
} from "@a-novel/connector-authentication/api";
import { SPACINGS } from "@a-novel/neon-ui";
import { MaterialSymbol, Modal } from "@a-novel/neon-ui/ui";
import { EmailInput } from "@a-novel/neon-ui/ux";

import { type MouseEventHandler, useEffect } from "react";

import { Button, Stack, Typography } from "@mui/material";
import {
  type FormAsyncValidateOrFn,
  type FormValidateOrFn,
  type ReactFormExtendedApi,
  useStore,
} from "@tanstack/react-form";
import { T, useTolgee, useTranslate } from "@tolgee/react";
import { z } from "zod";

export interface RequestRegisterFormConnector<
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

export interface RequestRegisterFormProps<
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
  connector: RequestRegisterFormConnector<
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

export const RequestRegisterForm = <
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
  connector,
}: RequestRegisterFormProps<
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
  const { addActiveNs, removeActiveNs } = useTolgee();
  const { t } = useTranslate("form");

  // Load / unload translations.
  useEffect(() => {
    addActiveNs(["authenticator.register", "form"]).catch(console.error);
    return () => removeActiveNs(["authenticator.register", "form"]);
  }, [addActiveNs, removeActiveNs]);

  const isSubmitting = useStore(connector.form.store, (state) => state.isSubmitting);
  const isSubmitSuccessful = useStore(connector.form.store, (state) => state.isSubmitSuccessful);
  const userEmail = useStore(connector.form.store, (state) => state.values.email);

  return (
    <>
      <PopupForm
        title={<T keyName="title" ns="authenticator.register" />}
        form={connector.form}
        submitButton={<T keyName={isSubmitting ? "form.submitting" : "form.submit"} ns="authenticator.register" />}
        footer={
          <PopupFormFooter>
            <Typography textAlign="center">
              <span>
                <T keyName="form.login.label" ns="authenticator.register" />{" "}
              </span>
              <Button variant="text" type="button" color="primary" onClick={connector.loginAction}>
                <T keyName="form.login.action" ns="authenticator.register" />
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
              helperText={<T keyName="fields.email.helper" ns="authenticator.register" />}
              maxLength={BINDINGS_VALIDATION.EMAIL.MAX}
            />
          )}
        </connector.form.Field>
      </PopupForm>

      <Modal
        title={<T keyName="form.success.title" ns="authenticator.register" />}
        icon={<MaterialSymbol icon="mark_email_read" />}
        open={isSubmitSuccessful}
      >
        <Typography sx={{ "> strong": { color: (theme) => theme.palette.primary.main } }}>
          <T keyName="form.success.main" ns="authenticator.register" params={{ mail: userEmail, strong: <strong /> }} />
        </Typography>
        <br />
        <Typography color="textSecondary">
          <T keyName="form.success.sub" ns="authenticator.register" />
        </Typography>
        <br />
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={SPACINGS.MEDIUM}>
          <Button type="button" color="primary" onClick={connector.loginAction}>
            <T keyName="form.success.action.login" ns="authenticator.register" />
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
