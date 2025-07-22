import { LoginForm, type LoginFormProps } from "~/components/forms";
import { FormPage } from "~/components/pages";

import { BINDINGS_VALIDATION } from "@a-novel/connector-authentication/api";
import { FormRenderer, NewMockForm } from "@a-novel/package-ui/storybook";

import { type FC } from "react";

import { type Meta, type StoryObj } from "@storybook/react-vite";
import { type ReactFormExtendedApi } from "@tanstack/react-form";

const RenderComponents: FC<
  LoginFormProps<any, any, any, any, any, any, any, any, any> & {
    form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any>;
  }
> = (props) => (
  <FormPage minHeight="100vh">
    <LoginForm connector={{ ...props.connector, form: props.form }} />
  </FormPage>
);

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    connector: { control: { disable: true } },
  },
  tags: ["autodocs"],
  render: (args) => <FormRenderer component={RenderComponents} form={args.connector.form} {...args} />,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    connector: {
      resetPasswordAction: () => {},
      registerAction: () => {},
      form: NewMockForm({
        values: {
          email: "",
          password: "",
        },
      }),
    },
  },
};

export const WithValues: Story = {
  args: {
    connector: {
      resetPasswordAction: () => {},
      registerAction: () => {},
      form: NewMockForm({
        values: {
          email: "user@provider.com",
          password: "123456",
        },
      }),
    },
  },
};

export const ValuesTooLong: Story = {
  args: {
    connector: {
      resetPasswordAction: () => {},
      registerAction: () => {},
      form: NewMockForm({
        values: {
          email: String("a").repeat(BINDINGS_VALIDATION.EMAIL.MAX),
          password: String("a").repeat(BINDINGS_VALIDATION.PASSWORD.MAX),
        },
      }),
    },
  },
};

export const FieldErrors: Story = {
  args: {
    connector: {
      resetPasswordAction: () => {},
      registerAction: () => {},
      form: NewMockForm({
        values: {
          email: "user@provider.com",
          password: "123456",
        },
        fieldErrors: {
          email: ["The email does not comply with our requirements."],
          password: [
            "The password does not comply with our requirements.",
            "The password must contain special characters.",
          ],
        },
      }),
    },
  },
};

export const Submitting: Story = {
  args: {
    connector: {
      resetPasswordAction: () => {},
      registerAction: () => {},
      form: NewMockForm({
        values: {
          email: "user@provider.com",
          password: "123456",
        },
        isSubmitting: true,
      }),
    },
  },
};

export const FieldsValidating: Story = {
  args: {
    connector: {
      resetPasswordAction: () => {},
      registerAction: () => {},
      form: NewMockForm({
        values: {
          email: "user@provider.com",
          password: "123456",
        },
        fieldsValidation: {
          email: true,
        },
      }),
    },
  },
};

export const LoginError: Story = {
  args: {
    connector: {
      resetPasswordAction: () => {},
      registerAction: () => {},
      form: NewMockForm({
        values: {
          email: "user@provider.com",
          password: "123456",
        },
        formErrors: {
          onSubmit: "An unexpected error occurred, please retry later.",
        },
      }),
    },
  },
};
