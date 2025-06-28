import "#/mocks/tolgee";
import { genericSetup } from "#/utils/setup";

import * as forms from "~/components/forms";
import * as formsConnectors from "~/connectors/forms";

import { AuthFormProvider, type AuthFormSelect, useAuthForm } from "./auth.form";

import { NewMockForm } from "@a-novel/neon-ui/storybook";

import { type FC, type ReactNode, useEffect } from "react";

import { render, waitFor } from "@testing-library/react";
import { it, describe, expect, vi } from "vitest";

const RenderForm: FC<{ form: AuthFormSelect | undefined }> = ({ form }) => {
  const { selectForm } = useAuthForm();

  useEffect(() => {
    selectForm(form);
  }, [form, selectForm]);

  return null;
};

const Layout: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <span>Layout</span>]{children}
  </>
);

describe("auth form provider", () => {
  genericSetup({});

  vi.spyOn(formsConnectors, "useLoginFormConnector").mockImplementation(() => ({
    form: NewMockForm({
      values: { email: "", password: "" },
    }),
    resetPasswordAction: vi.fn(),
    registerAction: vi.fn(),
  }));
  vi.spyOn(formsConnectors, "useRequestRegisterFormConnector").mockImplementation(() => ({
    form: NewMockForm({
      values: { email: "", password: "" },
    }),
    loginAction: vi.fn(),
  }));
  vi.spyOn(formsConnectors, "useRequestResetPasswordFormConnector").mockImplementation(() => ({
    form: NewMockForm({
      values: { email: "" },
    }),
    loginAction: vi.fn(),
  }));

  vi.spyOn(forms, "LoginForm").mockImplementation(() => <div>Login Form</div>);
  vi.spyOn(forms, "RequestRegisterForm").mockImplementation(() => <div>Register Form</div>);
  vi.spyOn(forms, "RequestResetPasswordForm").mockImplementation(() => <div>Reset Password Form</div>);

  it("renders children when no form is selected", async () => {
    const screen = render(
      <AuthFormProvider>
        <RenderForm form={undefined} />
        <div>Hello world!</div>
      </AuthFormProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Hello world!")).toBeDefined();
      expect(screen.queryByText("Login Form")).toBeNull();
      expect(screen.queryByText("Register Form")).toBeNull();
      expect(screen.queryByText("Reset Password Form")).toBeNull();
    });
  });

  it("renders login form", async () => {
    const screen = render(
      <AuthFormProvider>
        <RenderForm form="login" />
        <div>Hello world!</div>
      </AuthFormProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Hello world!")).toBeNull();
      expect(screen.queryByText("Login Form")).toBeDefined();
      expect(screen.queryByText("Register Form")).toBeNull();
      expect(screen.queryByText("Reset Password Form")).toBeNull();
    });
  });

  it("renders register form", async () => {
    const screen = render(
      <AuthFormProvider>
        <RenderForm form="register" />
        <div>Hello world!</div>
      </AuthFormProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Hello world!")).toBeNull();
      expect(screen.queryByText("Login Form")).toBeNull();
      expect(screen.queryByText("Register Form")).toBeDefined();
      expect(screen.queryByText("Reset Password Form")).toBeNull();
    });
  });

  it("renders reset password form", async () => {
    const screen = render(
      <AuthFormProvider>
        <RenderForm form="resetPassword" />
        <div>Hello world!</div>
      </AuthFormProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Hello world!")).toBeNull();
      expect(screen.queryByText("Login Form")).toBeNull();
      expect(screen.queryByText("Register Form")).toBeNull();
      expect(screen.queryByText("Reset Password Form")).toBeDefined();
    });
  });

  it("renders layout with children", async () => {
    const screen = render(
      <AuthFormProvider layout={Layout}>
        <RenderForm form={undefined} />
        <div>Hello world!</div>
      </AuthFormProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Hello world!")).toBeDefined();
      expect(screen.queryByText("Layout")).toBeDefined();
      expect(screen.queryByText("Login Form")).toBeNull();
      expect(screen.queryByText("Register Form")).toBeNull();
      expect(screen.queryByText("Reset Password Form")).toBeNull();
    });
  });

  it("renders layout with form", async () => {
    const screen = render(
      <AuthFormProvider layout={Layout}>
        <RenderForm form="login" />
        <div>Hello world!</div>
      </AuthFormProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Hello world!")).toBeNull();
      expect(screen.queryByText("Layout")).toBeDefined();
      expect(screen.queryByText("Login Form")).toBeDefined();
      expect(screen.queryByText("Register Form")).toBeNull();
      expect(screen.queryByText("Reset Password Form")).toBeNull();
    });
  });
});
