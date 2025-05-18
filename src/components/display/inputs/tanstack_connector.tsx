import { i18nPKG } from "../../../shared/i18n";

import { InfoBox, type InfoboxProps, MaterialSymbol } from "@a-novel/neon-ui";

import type { FC } from "react";

import { type FieldApi, type ReactFormExtendedApi, useStore } from "@tanstack/react-form";
import { Translation } from "react-i18next";

/**
 * Field errors are Zod validation errors, or string errors parsed from the API response.
 */
const printFieldErrors = (err: any): string[] => {
  // Error is already a string, youhou.
  if (typeof err === "string") {
    return [err];
  }

  // Recursive call on all errors.
  if (Array.isArray(err)) {
    return err.flatMap((e) => printFieldErrors(e));
  }

  // Best attempt to extract the message from the error.
  return [err?.message ?? err?.toString() ?? JSON.stringify(err)];
};

export type AnyFieldAPI = FieldApi<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;

export type AnyFormAPI = ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any>;

export interface PropsWithField {
  field: AnyFieldAPI;
}

export interface PropsWithForm {
  form: AnyFormAPI;
}

export const RenderFieldErrors: FC<PropsWithField> = ({ field }) => {
  // Flatten all errors into a single array of string messages, ready to be printed.
  const errors = useStore(field.store, (state) => state.meta.errors.flatMap(printFieldErrors));

  if (errors.length === 0) {
    return null;
  }

  // Return a standalone message.
  if (errors.length === 1) {
    return (
      <InfoBox icon={<MaterialSymbol icon="error" />} color="error">
        {errors}
      </InfoBox>
    );
  }

  // Concatenate all errors into a list, then return a single message.
  return (
    <InfoBox icon={<MaterialSymbol icon="error" />} color="error">
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </InfoBox>
  );
};

export const RenderTooLongWarning: FC<PropsWithField & { maxLength: number }> = ({ field, maxLength }) => {
  const value = useStore(field.store, (state) => state.value);
  const valueLength = typeof value === "string" ? value.length : 0;

  if (valueLength < maxLength) {
    return null;
  }

  return (
    <InfoBox icon={<MaterialSymbol icon="cancel" />} color="secondary">
      <Translation i18n={i18nPKG} ns="input">
        {(t) => t("input:text.errors.tooLong", { count: maxLength })}
      </Translation>
    </InfoBox>
  );
};

export interface RenderFormErrorsProps {
  customErrors?: ((err: any) => InfoboxProps | undefined)[];
}

export const RenderFormErrors: FC<PropsWithForm & RenderFormErrorsProps> = ({ form, customErrors = [] }) => {
  const submitError = useStore(form.store, (state) => state.errorMap.onSubmit);

  if (!submitError) {
    return null;
  }

  for (const matchFn of customErrors) {
    const props = matchFn(submitError);

    if (props) {
      return <InfoBox {...props} />;
    }
  }

  return (
    <InfoBox icon={<MaterialSymbol icon="heart_broken" />} color="error">
      {printFieldErrors(submitError)}
    </InfoBox>
  );
};

export const useInputStatus = (field: AnyFieldAPI): "primary" | "error" => {
  const errors = useStore(field.store, (state) => state.meta.errors);

  if (errors.length > 0) {
    return "error";
  }

  return "primary";
};
