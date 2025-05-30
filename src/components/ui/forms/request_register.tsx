import { i18nPKG } from "../../../shared/i18n";
import { EmailInput } from "../inputs";
import { PopupForm, PopupFormFooter } from "./common";

import { RequestRegistrationForm as RequestRegistrationRequest } from "@a-novel/connector-authentication/api";
import { SPACINGS } from "@a-novel/neon-ui";
import { MaterialSymbol, Modal } from "@a-novel/neon-ui/ui";

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
  const userEmail = useStore(form.store, (state) => state.values.email);

  return (
    <>
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

      <Modal
        title={t("register:success.title")}
        icon={<MaterialSymbol icon="mark_email_read" />}
        open={isSubmitSuccessful}
      >
        <Typography sx={{ "> strong": { color: (theme) => theme.palette.primary.main } }}>
          <Trans i18nKey="register:success.main" values={{ mail: userEmail }} />
        </Typography>
        <br />
        <Typography color="textSecondary">{t("register:success.sub")}</Typography>
        <br />
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={SPACINGS.MEDIUM}>
          <Button type="button" color="primary" onClick={loginAction}>
            {t("register:form.toLogin.action")}
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
