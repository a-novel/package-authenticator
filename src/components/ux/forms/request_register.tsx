import { useAccessToken } from "../../../contexts";
import { getLang, i18nPKG } from "../../../shared/i18n";
import { RequestRegistrationForm as RequestRegisterFormComponent } from "../../ui/forms";

import { BINDINGS_VALIDATION, Lang, LangEnum } from "@a-novel/connector-authentication/api";
import { RequestRegister } from "@a-novel/connector-authentication/hooks";

import { type FC, type MouseEventHandler } from "react";

import { useForm } from "@tanstack/react-form";
import { type TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export interface RequestRegisterFormProps {
  /**
   * The action used to switch to the login form.
   */
  loginAction: MouseEventHandler<HTMLButtonElement>;
}

type FormTFunction = TFunction<readonly ["register", "input"]>;

/**
 * Extends the original form with translated error messages.
 */
const formValidator = (t: FormTFunction) =>
  z.object({
    email: z
      .string()
      .min(
        BINDINGS_VALIDATION.EMAIL.MIN,
        t("input:text.errors.tooShort", {
          count: BINDINGS_VALIDATION.EMAIL.MIN,
          field: t("register:fields.email.errors.field"),
        })
      )
      .max(
        BINDINGS_VALIDATION.EMAIL.MAX,
        t("input:text.errors.tooLong", {
          count: BINDINGS_VALIDATION.EMAIL.MAX,
          field: t("register:fields.email.errors.field"),
        })
      )
      .email(t("register:fields.email.errors.invalid")),
    lang: Lang,
  });

/**
 * Handle error from login form submit. Properly sets field errors for tanstack depending on the returned value.
 */
const handleSubmitError = (t: FormTFunction) => () => t("register:form.errors.generic");

export const RequestRegisterForm: FC<RequestRegisterFormProps> = ({ loginAction }) => {
  const { t } = useTranslation(["register", "input"], { i18n: i18nPKG });

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
            lang: getLang(),
          })
          .then(() => null)
          .catch(handleSubmitError(t)),
    },
  });

  return <RequestRegisterFormComponent form={form} loginAction={loginAction} />;
};
