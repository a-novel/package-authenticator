import { type AnyFormAPI } from "../../src/components/ui/inputs";

import { type ComponentType } from "react";

import { FormApi, type FormValidationErrorMap, useForm } from "@tanstack/react-form";

export type FormRendererProps<P, F extends AnyFormAPI> = P & { form: F };

export const FormRenderer = <P, F extends AnyFormAPI>({
  component: Component,
  ...props
}: FormRendererProps<P, F> & { component: ComponentType<FormRendererProps<P, F>> }) => {
  const form = useForm({
    defaultValues: props.form.state.values,
    defaultState: {
      isSubmitting: props.form.store.state.isSubmitting,
      isSubmitSuccessful: props.form.store.state.isSubmitSuccessful,
      errors: props.form.store.state.errors,
      errorMap: props.form.store.state.errorMap,
    },
  });

  // Hijack the function responsible from triggering form changes, so the UI is not interactive.
  const InitialFormField = form.Field;
  /* eslint-disable react/prop-types */
  form.Field = function HijackedField({ children, ...fieldProps }) {
    return (
      <InitialFormField {...fieldProps}>
        {(field) => {
          field.handleChange = () => {};
          field.store.state.meta = props.form.state.fieldMeta[field.name] ?? field.store.state.meta;
          field.form.store.state.isSubmitting = props.form.store.state.isSubmitting;
          field.form.store.state.isSubmitSuccessful = props.form.store.state.isSubmitSuccessful;
          field.form.store.state.errorMap = props.form.store.state.errorMap;
          return children(field);
        }}
      </InitialFormField>
    );
  };

  return <Component {...(props as FormRendererProps<P, F>)} form={form as F} />;
};

export interface MockFormProps {
  values: Record<string, any>;
  formErrors?: FormValidationErrorMap;
  fieldErrors?: Record<string, string[]>;
  fieldsValidation?: Record<string, boolean>;
  isSubmitting?: boolean;
  isSuccess?: boolean;
}

export const NewMockForm = <F extends AnyFormAPI>(props: MockFormProps): F => {
  const api = new FormApi({
    defaultValues: props.values,
  });

  api.store.state.isSubmitting = props.isSubmitting ?? false;
  api.store.state.isSubmitSuccessful = props.isSuccess ?? false;
  api.store.state.errorMap = { ...props.formErrors } as any;

  api.store.state.fieldMeta = Object.keys(props.values).reduce(
    (acc, field) => ({
      ...acc,
      [field]: {
        errors: props.fieldErrors?.[field] ?? [],
        errorSourceMap: {},
        isValid: false,
        isTouched: true,
        isDirty: true,
        isBlurred: false,
        errorMap: {},
        isValidating: props.fieldsValidation?.[field] ?? false,
        isPristine: false,
      },
    }),
    {}
  );

  api.store.state.errorMap = { ...props.formErrors } as any;

  return api as unknown as F;
};
