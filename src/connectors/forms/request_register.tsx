import { type RequestRegisterFormConnector } from "~/components/forms";
import { useAccessToken } from "~/contexts";
import { getLang } from "~/shared";

import { BINDINGS_VALIDATION, Lang, LangEnum } from "@a-novel/connector-authentication/api";
import { RequestRegister } from "@a-novel/connector-authentication/hooks";
import { useTolgeeNs } from "@a-novel/package-ui/translations";

import { type MouseEventHandler } from "react";

import { useForm } from "@tanstack/react-form";
import { useTolgee, useTranslate, type UseTranslateResult } from "@tolgee/react";
import { z } from "zod";

export interface RequestRegisterFormConnectorParams {
  /**
   * The action used to switch to the login form.
   */
  loginAction: MouseEventHandler<HTMLButtonElement>;
}

type FormTFunction = UseTranslateResult["t"];

const ns = ["form", "generic", "authenticator.register"];

export function useRequestRegisterFormConnector({
  loginAction,
}: RequestRegisterFormConnectorParams): RequestRegisterFormConnector<any, any, any, any, any, any, any, any, any> {
  const { getLanguage, getPendingLanguage } = useTolgee();
  const { t } = useTranslate(ns);
  useTolgeeNs(ns);

  const accessToken = useAccessToken();
  const requestRegistrationLink = RequestRegister.useAPI(accessToken);

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
        requestRegistrationLink
          .mutateAsync({
            ...value,
            // Override the lang with the one inferred from the i18n instance. This language will be used for
            // the email sent to the user.
            lang: getLang(getLanguage() ?? getPendingLanguage() ?? LangEnum.En),
          })
          .then(() => null)
          .catch(newSubmitErrorHandler(t)),
    },
  });

  return {
    form,
    loginAction,
  };
}

/**
 * Extends the original form with translated error messages.
 */
function formValidator(t: FormTFunction) {
  return z.object({
    email: z
      .email(t("fields.email.errors.invalid", { ns: "form" }))
      .nonempty(t("text.errors.required", { ns: "form" }))
      .min(
        BINDINGS_VALIDATION.EMAIL.MIN,
        t("text.errors.tooShort", {
          ns: "form",
          count: BINDINGS_VALIDATION.EMAIL.MIN,
        })
      )
      .max(
        BINDINGS_VALIDATION.EMAIL.MAX,
        t("text.errors.tooLong", {
          ns: "form",
          count: BINDINGS_VALIDATION.EMAIL.MAX,
        })
      ),
    lang: Lang,
  });
}

/**
 * Handle error from login form submit. Properly sets field errors for tanstack depending on the returned value.
 */
function newSubmitErrorHandler(t: FormTFunction) {
  return function handleSubmitError() {
    return `${t("form.errors.generic", { ns: "authenticator.register" })} ${t("error", { ns: "generic" })}`;
  };
}
