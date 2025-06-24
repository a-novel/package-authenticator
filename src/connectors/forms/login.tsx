import { type LoginFormConnector } from "../../components/forms";
import { useSession } from "../../contexts";
import { i18nPKG } from "../../shared/i18n";

import { BINDINGS_VALIDATION, isForbiddenError, isUserNotFoundError } from "@a-novel/connector-authentication/api";
import { CreateSession } from "@a-novel/connector-authentication/hooks";

import { type MouseEventHandler } from "react";

import { useForm } from "@tanstack/react-form";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export interface LoginFormConnectorParams {
  /**
   * The action used to switch to the reset password form.
   */
  resetPasswordAction: MouseEventHandler<HTMLButtonElement>;
  /**
   * The action used to switch to the register form.
   */
  registerAction: MouseEventHandler<HTMLButtonElement>;
  /**
   * Action to run after successful login.
   */
  onLogin: () => void;
}

type FormTFunction = TFunction<readonly ["form", "generic", "authenticator.login"]>;

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
    password: z
      .string()
      .nonempty(t("form:text.errors.required"))
      .min(
        BINDINGS_VALIDATION.PASSWORD.MIN,
        t("form:text.errors.tooShort", {
          count: BINDINGS_VALIDATION.EMAIL.MIN,
        })
      )
      .max(
        BINDINGS_VALIDATION.PASSWORD.MAX,
        t("form:text.errors.tooLong", {
          count: BINDINGS_VALIDATION.EMAIL.MAX,
        })
      ),
  });

/**
 * Handle error from login form submit. Properly sets field errors for tanstack depending on the returned value.
 */
const handleSubmitError = (t: FormTFunction) => (error: any) => {
  if (isForbiddenError(error)) {
    return {
      fields: { password: t("form:fields.password.errors.invalid") },
    };
  }

  if (isUserNotFoundError(error)) {
    return {
      fields: { email: t("form:fields.email.errors.notFound") },
    };
  }

  return `${t("authenticator.login:form.errors.generic")} ${t("generic:error")}`;
};

export const useLoginFormConnector = ({
  resetPasswordAction,
  registerAction,
  onLogin,
}: LoginFormConnectorParams): LoginFormConnector<any, any, any, any, any, any, any, any, any> => {
  const { t } = useTranslation(["form", "generic", "authenticator.login"], { i18n: i18nPKG });

  const createSession = CreateSession.useAPI();
  const { setSession } = useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
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
        createSession
          .mutateAsync(value)
          .then((res) => {
            setSession({ accessToken: res.accessToken });
          })
          .catch(handleSubmitError(t)),
    },
    onSubmit: onLogin,
  });

  return {
    form,
    resetPasswordAction,
    registerAction,
  };
};
