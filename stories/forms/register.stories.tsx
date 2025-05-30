import { RequestRegistrationForm, type RegisterFormProps } from "../../src/components/ui/forms";
import { FormPage } from "../../src/components/ui/pages";

import { BINDINGS_VALIDATION } from "@a-novel/connector-authentication/api";
import { FormRenderer, NewMockForm } from "@a-novel/neon-ui/storybook";

import { type FC } from "react";

import { type Meta, type StoryObj } from "@storybook/react-vite";

const RenderComponents: FC<RegisterFormProps<any, any, any, any, any, any, any, any, any>> = (props) => (
  <FormPage minHeight="100vh">
    <RequestRegistrationForm form={props.form} loginAction={() => null} />
  </FormPage>
);

const meta: Meta<typeof RequestRegistrationForm> = {
  component: RequestRegistrationForm,
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
      },
    }),
  },
};

export const WithValues: Story = {
  args: {
    form: NewMockForm({
      values: {
        email: "user@provider.com",
      },
    }),
  },
};

export const ValuesTooLong: Story = {
  args: {
    form: NewMockForm({
      values: {
        email: String("a").repeat(BINDINGS_VALIDATION.EMAIL.MAX),
      },
    }),
  },
};

export const FieldErrors: Story = {
  args: {
    form: NewMockForm({
      values: {
        email: "user@provider.com",
      },
      fieldErrors: {
        email: ["The email does not comply with our requirements."],
      },
    }),
  },
};

export const Submitting: Story = {
  args: {
    form: NewMockForm({
      values: {
        email: "user@provider.com",
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
      },
      fieldsValidation: {
        email: true,
      },
    }),
  },
};

export const RegisterError: Story = {
  args: {
    form: NewMockForm({
      values: {
        email: "user@provider.com",
      },
      formErrors: {
        onSubmit: ["An unexpected error occurred, please retry later."],
      },
    }),
  },
};

export const Success: Story = {
  args: {
    form: NewMockForm({
      values: {
        email: "user@provider.com",
      },
      isSuccess: true,
    }),
  },
};
