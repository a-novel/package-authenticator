import { type RequestResetPasswordFormConnector } from "../../components/forms";
import { useAccessToken } from "../../contexts";
import { getLang, i18nPKG } from "../../shared/i18n";

import { BINDINGS_VALIDATION, isUserNotFoundError, Lang, LangEnum } from "@a-novel/connector-authentication/api";
import { RequestPasswordReset } from "@a-novel/connector-authentication/hooks";

import { type MouseEventHandler } from "react";

import { useForm } from "@tanstack/react-form";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export interface RequestResetPasswordFormConnectorParams {
  /**
   * The action used to switch to the login form.
   */
  loginAction: MouseEventHandler<HTMLButtonElement>;
}

type FormTFunction = TFunction<readonly ["form", "generic", "authenticator.resetPassword"]>;

/**
 * Extends the original form with translated error messages.
 */
const formValidator = (t: FormTFunction) =>
  z.object({
    email: z
      .string()
      .nonempty(t("form:text.errors.required"))
      .min(
        BINDINGS_VALIDATION.EMAIL.MIN,
        t("form:text.errors.tooShort", {
          count: BINDINGS_VALIDATION.EMAIL.MIN,
        })
      )
      .max(
        BINDINGS_VALIDATION.EMAIL.MAX,
        t("form:text.errors.tooLong", {
          count: BINDINGS_VALIDATION.EMAIL.MAX,
        })
      )
      .email(t("form:fields.email.errors.invalid")),
    lang: Lang,
  });

/**
 * Handle error from login form submit. Properly sets field errors for tanstack depending on the returned value.
 */
const handleSubmitError = (t: FormTFunction) => (error: any) => {
  if (isUserNotFoundError(error)) {
    return {
      fields: { email: t("form:fields.email.errors.notFound") },
    };
  }

  return `${t("authenticator.resetPassword:form.errors.generic")} ${t("generic:error")}`;
};

export const useRequestResetPasswordFormConnector = ({
  loginAction,
}: RequestResetPasswordFormConnectorParams): RequestResetPasswordFormConnector<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
> => {
  const { t } = useTranslation(["form", "generic", "authenticator.resetPassword"], { i18n: i18nPKG });

  const accessToken = useAccessToken();
  const requestResetPasswordLink = RequestPasswordReset.useAPI(accessToken);

  const form = useForm({
    defaultValues: {
      email: "",
      lang: LangEnum.En,
    },
    validators: {
      onBlur: formValidator(t),
      // Tanstack does not officially support setting field-level errors from the main submit handler.
      // We thus send the form through the onSubmitAsync validator (this normally only runs after successful
      // onSubmit). This allows us to set field-level errors according to the server response.
      //
      // More information on this topic.
      // https://github.com/TanStack/form/discussions/623
      onSubmitAsync: ({ value }) =>
        requestResetPasswordLink
          .mutateAsync({
            ...value,
            // Override the lang with the one inferred from the i18n instance. This language will be used for
            // the email sent to the user.
            lang: getLang(),
          })
          .then(() => null)
          .catch(handleSubmitError(t)),
    },
  });

  return {
    form,
    loginAction,
  };
};
