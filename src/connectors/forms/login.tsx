import { type LoginFormConnector } from "~/components/forms";
import { useSession } from "~/contexts";

import { BINDINGS_VALIDATION, isForbiddenError, isUserNotFoundError } from "@a-novel/connector-authentication/api";
import { CreateSession } from "@a-novel/connector-authentication/hooks";
import { useTolgeeNs } from "@a-novel/package-ui/translations";

import { type MouseEventHandler } from "react";

import { useForm } from "@tanstack/react-form";
import { useTranslate, type UseTranslateResult } from "@tolgee/react";
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

type FormTFunction = UseTranslateResult["t"];

const ns = ["form", "generic", "authenticator.login"];

export function useLoginFormConnector({
  resetPasswordAction,
  registerAction,
  onLogin,
}: LoginFormConnectorParams): LoginFormConnector {
  const { t } = useTranslate(ns);
  useTolgeeNs(ns);

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
            setSession({ accessToken: res.accessToken, refreshToken: res.refreshToken });
          })
          .catch(newSubmitErrorHandler(t)),
    },
    onSubmit: onLogin,
  });

  return {
    form,
    resetPasswordAction,
    registerAction,
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
    password: z
      .string()
      .nonempty(t("text.errors.required", { ns: "form" }))
      .min(
        BINDINGS_VALIDATION.PASSWORD.MIN,
        t("text.errors.tooShort", {
          ns: "form",
          count: BINDINGS_VALIDATION.PASSWORD.MIN,
        })
      )
      .max(
        BINDINGS_VALIDATION.PASSWORD.MAX,
        t("text.errors.tooLong", {
          ns: "form",
          count: BINDINGS_VALIDATION.PASSWORD.MAX,
        })
      ),
  });
}

/**
 * Handle error from login form submit. Properly sets field errors for tanstack depending on the returned value.
 */
function newSubmitErrorHandler(t: FormTFunction) {
  return function handleSubmitError(error: any) {
    if (isForbiddenError(error)) {
      return {
        fields: { password: t("fields.password.errors.invalid", { ns: "form" }) },
      };
    }

    if (isUserNotFoundError(error)) {
      return {
        fields: { email: t("fields.email.errors.notFound", { ns: "form" }) },
      };
    }

    return `${t("form.errors.generic", { ns: "authenticator.login" })} ${t("error", { ns: "generic" })}`;
  };
}
