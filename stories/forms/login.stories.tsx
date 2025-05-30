import { LoginForm, type LoginFormProps } from "../../src/components/ui/forms";
import { FormPage } from "../../src/components/ui/pages";

import { BINDINGS_VALIDATION } from "@a-novel/connector-authentication/api";
import { FormRenderer, NewMockForm } from "@a-novel/neon-ui/storybook";

import { type FC } from "react";

import { type Meta, type StoryObj } from "@storybook/react-vite";

const RenderComponents: FC<LoginFormProps<any, any, any, any, any, any, any, any, any>> = (props) => (
  <FormPage minHeight="100vh">
    <LoginForm form={props.form} registerAction={() => null} resetPasswordAction={() => null} />
  </FormPage>
);

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    form: { control: { disable: true } },
  },
  tags: ["autodocs"],
  render: (args) => <FormRenderer component={RenderComponents} {...args} />,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    form: NewMockForm({
      values: {
        email: "",
        password: "",
      },
    }),
  },
};

export const WithValues: Story = {
  args: {
    form: NewMockForm({
      values: {
        email: "user@provider.com",
        password: "123456",
      },
    }),
  },
};

export const ValuesTooLong: Story = {
  args: {
    form: NewMockForm({
      values: {
        email: String("a").repeat(BINDINGS_VALIDATION.EMAIL.MAX),
        password: String("a").repeat(BINDINGS_VALIDATION.PASSWORD.MAX),
      },
    }),
  },
};

export const FieldErrors: Story = {
  args: {
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
};

export const Submitting: Story = {
  args: {
    form: NewMockForm({
      values: {
        email: "user@provider.com",
        password: "123456",
      },
      isSubmitting: true,
    }),
  },
};

export const FieldsValidating: Story = {
  args: {
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
};

export const LoginError: Story = {
  args: {
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
};
