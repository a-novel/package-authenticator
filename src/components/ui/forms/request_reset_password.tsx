import { i18nPKG } from "../../../shared/i18n";
import { EmailInput } from "../inputs";
import { PopupForm, PopupFormFooter } from "./common";

import { RequestPasswordResetForm as RequestPasswordResetRequest } from "@a-novel/connector-authentication/api";
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
  const userEmail = useStore(form.store, (state) => state.values.email);

  return (
    <>
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

      <Modal
        title={t("resetPassword:success.title")}
        icon={<MaterialSymbol icon="mark_email_read" />}
        open={isSubmitSuccessful}
      >
        <Typography sx={{ "> strong": { color: (theme) => theme.palette.primary.main } }}>
          <Trans i18nKey="resetPassword:success.main" values={{ mail: userEmail }} />
        </Typography>
        <br />
        <Typography color="textSecondary">{t("resetPassword:success.sub")}</Typography>
        <br />
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={SPACINGS.MEDIUM}>
          <Button type="button" color="primary" onClick={loginAction}>
            {t("resetPassword:form.backToLogin.action")}
          </Button>
        </Stack>
      </Modal>
    </>
  );
};
