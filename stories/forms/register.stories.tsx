import { RequestRegisterForm, type RequestRegisterFormProps } from "../../src/components/forms";
import { FormPage } from "../../src/components/pages";

import { BINDINGS_VALIDATION } from "@a-novel/connector-authentication/api";
import { FormRenderer, NewMockForm } from "@a-novel/neon-ui/storybook";

import { type FC } from "react";

import { type Meta, type StoryObj } from "@storybook/react-vite";
import type { ReactFormExtendedApi } from "@tanstack/react-form";

const RenderComponents: FC<
  RequestRegisterFormProps<any, any, any, any, any, any, any, any, any> & {
    form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any>;
  }
> = (props) => (
  <FormPage minHeight="100vh">
    <RequestRegisterForm connector={{ ...props.connector, form: props.form }} />
  </FormPage>
);

const meta: Meta<typeof RequestRegisterForm> = {
  component: RequestRegisterForm,
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
      loginAction: () => {},
      form: NewMockForm({
        values: {
          email: "",
        },
      }),
    },
  },
};

export const WithValues: Story = {
  args: {
    connector: {
      loginAction: () => {},
      form: NewMockForm({
        values: {
          email: "user@provider.com",
        },
      }),
    },
  },
};

export const ValuesTooLong: Story = {
  args: {
    connector: {
      loginAction: () => {},
      form: NewMockForm({
        values: {
          email: String("a").repeat(BINDINGS_VALIDATION.EMAIL.MAX),
        },
      }),
    },
  },
};

export const FieldErrors: Story = {
  args: {
    connector: {
      loginAction: () => {},
      form: NewMockForm({
        values: {
          email: "user@provider.com",
        },
        fieldErrors: {
          email: ["The email does not comply with our requirements."],
        },
      }),
    },
  },
};

export const Submitting: Story = {
  args: {
    connector: {
      loginAction: () => {},
      form: NewMockForm({
        values: {
          email: "user@provider.com",
        },
        isSubmitting: true,
      }),
    },
  },
};

export const FieldsValidating: Story = {
  args: {
    connector: {
      loginAction: () => {},
      form: NewMockForm({
        values: {
          email: "user@provider.com",
        },
        fieldsValidation: {
          email: true,
        },
      }),
    },
  },
};

export const RegisterError: Story = {
  args: {
    connector: {
      loginAction: () => {},
      form: NewMockForm({
        values: {
          email: "user@provider.com",
        },
        formErrors: {
          onSubmit: ["An unexpected error occurred, please retry later."],
        },
      }),
    },
  },
};

export const Success: Story = {
  args: {
    connector: {
      loginAction: () => {},
      form: NewMockForm({
        values: {
          email: "user@provider.com",
        },
        isSuccess: true,
      }),
    },
  },
};
