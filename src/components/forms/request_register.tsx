import { i18nPKG } from "~/shared/i18n";

import { PopupForm, PopupFormFooter } from "./common";

import {
  BINDINGS_VALIDATION,
  RequestRegistrationForm as RequestRegistrationRequest,
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
  const { t } = useTranslation(["authenticator.register", "form"], { i18n: i18nPKG });

  const isSubmitting = useStore(connector.form.store, (state) => state.isSubmitting);
  const isSubmitSuccessful = useStore(connector.form.store, (state) => state.isSubmitSuccessful);
  const userEmail = useStore(connector.form.store, (state) => state.values.email);

  return (
    <>
      <PopupForm
        title={t("authenticator.register:title")}
        form={connector.form}
        submitButton={
          isSubmitting ? t("authenticator.register:form.submitting") : t("authenticator.register:form.submit")
        }
        footer={
          <PopupFormFooter>
            <Typography textAlign="center">
              <span>{t("authenticator.register:form.login.label")} </span>
              <Button variant="text" type="button" color="primary" onClick={connector.loginAction}>
                {t("authenticator.register:form.login.action")}
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
              helperText={t("authenticator.register:fields.email.helper")}
              maxLength={BINDINGS_VALIDATION.EMAIL.MAX}
            />
          )}
        </connector.form.Field>
      </PopupForm>

      <Modal
        title={t("authenticator.register:form.success.title")}
        icon={<MaterialSymbol icon="mark_email_read" />}
        open={isSubmitSuccessful}
      >
        <Typography sx={{ "> strong": { color: (theme) => theme.palette.primary.main } }}>
          <Trans i18nKey="authenticator.register:form.success.main" values={{ mail: userEmail }} />
        </Typography>
        <br />
        <Typography color="textSecondary">{t("authenticator.register:form.success.sub")}</Typography>
        <br />
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={SPACINGS.MEDIUM}>
          <Button type="button" color="primary" onClick={connector.loginAction}>
            {t("authenticator.register:form.success.action")}
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
