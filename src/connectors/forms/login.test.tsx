import { MockQueryClient } from "#/mocks/query_client";
import "#/mocks/tolgee";
import { writeField } from "#/utils/field";
import { server } from "#/utils/setup";
import { StandardWrapper } from "#/utils/wrapper";

import { LoginForm, type LoginFormConnector } from "~/components/forms";
import { SessionProvider } from "~/contexts";
import { TestSessionRenderer } from "~/contexts/session.test";

import { useLoginFormConnector } from "./login";

import { BINDINGS_VALIDATION } from "@a-novel/connector-authentication/api";
import { http } from "@a-novel/nodelib/msw";

import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  renderHook,
  type RenderHookResult,
  type RenderResult,
  waitFor,
} from "@testing-library/react";
import { HttpResponse } from "msw";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

let loginFormConnector: RenderHookResult<
  LoginFormConnector<any, any, any, any, any, any, any, any, any>,
  {
    resetPasswordAction: Mock<any>;
    registerAction: Mock<any>;
    onLogin: Mock<any>;
  }
>;
let screen: RenderResult;

let queryClient: QueryClient;

const resetPasswordAction = vi.fn();
const registerAction = vi.fn();
const loginAction = vi.fn();

describe("LoginForm", () => {
  beforeEach(() => {
    queryClient = new QueryClient(MockQueryClient);

    // Render the hook, then inject the connector into the form.
    loginFormConnector = renderHook((props) => useLoginFormConnector(props), {
      initialProps: { resetPasswordAction, registerAction, onLogin: loginAction },
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <TestSessionRenderer />
            {children}
          </SessionProvider>
        </QueryClientProvider>
      ),
    });

    screen = render(<LoginForm connector={loginFormConnector.result.current} />, {
      wrapper: StandardWrapper,
    });
  });

  // Ensure the login form renders every field, and all of them are enabled.
  describe("renders", async () => {
    // Verify inputs are rendered.
    const inputs = [/form:fields\.email\.label/, /form:fields\.password\.label/];

    for (const label of inputs) {
      it(`renders input with label ${label}`, () => {
        const input = screen.getByLabelText(label) as HTMLInputElement;
        expect(input).toBeDefined();
        expect((input as HTMLInputElement).disabled).toBe(false);
      });
    }

    // Verify buttons state.
    const actions = [
      {
        label: /authenticator\.login:fields\.password\.helper\.action/,
        action: resetPasswordAction,
      },
      {
        label: /authenticator\.login:form\.register\.action/,
        action: registerAction,
      },
    ];

    for (const { label, action } of actions) {
      it(`renders button with label ${label}`, () => {
        const button = screen.getByText(label, { selector: "button" }) as HTMLButtonElement;
        expect(button).toBeDefined();
        expect(button.disabled).toBe(false);
        // Click on button to trigger the action.
        expect(action).not.toHaveBeenCalled();
        act(() => {
          button.click();
        });
        expect(action).toHaveBeenCalled();
      });
    }
  });

  describe("form state", () => {
    const fields = [
      {
        name: "email",
        tKey: /form:fields\.email\.label/,
        max: BINDINGS_VALIDATION.EMAIL.MAX,
        min: BINDINGS_VALIDATION.EMAIL.MIN,
        required: true,
      },
      {
        name: "password",
        tKey: /form:fields\.password\.label/,
        max: BINDINGS_VALIDATION.PASSWORD.MAX,
        min: BINDINGS_VALIDATION.PASSWORD.MIN,
        required: true,
      },
    ];

    for (const field of fields) {
      describe(`field: ${field.name}`, () => {
        it("renders no error initially", () => {
          expect(screen.queryAllByText(/text.errors.tooLong/)).length(0);
          expect(screen.queryAllByText(/text.errors.tooShort/)).length(0);
          expect(screen.queryAllByText(/text.errors.required/)).length(0);
        });

        const initialForm = {
          email: { tKey: /form:fields\.email\.label/, value: "user@provider.com" },
          password: { tKey: /form:fields\.password\.label/, value: "123456" },
        };

        const cases = {
          standard: {
            value: "a".repeat(field.max - 1),
            expectValue: undefined,
            errors: {
              tooLong: 0,
              tooShort: 0,
              required: 0,
            },
          },
          tooLong: {
            value: "a".repeat(field.max * 2),
            expectValue: "a".repeat(field.max),
            errors: {
              tooLong: 1,
              tooShort: 0,
              required: 0,
            },
          },
          empty: {
            value: "",
            expectValue: undefined,
            errors: {
              tooLong: 0,
              tooShort: field.min > 0 ? 1 : 0,
              required: field.required ? 1 : 0,
            },
          },
          tooShort: {
            value: "a".repeat(field.min - 1),
            expectValue: undefined,
            errors: {
              tooLong: 0,
              tooShort: field.min > 1 ? 1 : 0,
              required: 0,
            },
          },
        };

        for (const [caseName, testCase] of Object.entries(cases)) {
          it(`handles ${caseName} case`, async () => {
            // Because writing a field will trigger validation for all of them, we MUST make sure they are
            // all filled before writing our target field.
            for (const [_, fieldData] of Object.entries(initialForm)) {
              const fieldInput = screen.getByLabelText(fieldData.tKey) as HTMLInputElement;
              expect(fieldInput).toBeDefined();
              await writeField(fieldInput, fieldData.value);
            }

            await waitFor(() => {
              expect(screen.queryAllByText(/text.errors.tooLong/)).length(0);
              expect(screen.queryAllByText(/text.errors.tooShort/)).length(0);
              expect(screen.queryAllByText(/text.errors.required/)).length(0);
            });

            const fieldInput = screen.getByLabelText(field.tKey) as HTMLInputElement;
            expect(fieldInput).toBeDefined();

            // Write the field with the test case value.
            await writeField(fieldInput, testCase.value, testCase.expectValue as string | undefined);

            // Check the errors.
            await waitFor(() => {
              expect(screen.queryAllByText(/text.errors.tooLong/)).length(testCase.errors.tooLong);
              expect(screen.queryAllByText(/text.errors.tooShort/)).length(testCase.errors.tooShort);
              expect(screen.queryAllByText(/text.errors.required/)).length(testCase.errors.required);
            });
          });
        }
      });
    }

    it("handles email validation", async () => {
      const emailInput = screen.getByLabelText(/form:fields\.email\.label/) as HTMLInputElement;
      expect(emailInput).toBeDefined();

      // Write an invalid email.
      await writeField(emailInput, "invalid-email");
      // Check for the invalid email error.
      await waitFor(() => {
        expect(screen.queryByText(/form:fields\.email\.errors\.invalid/)).toBeDefined();
      });

      // Write a valid email.
      await writeField(emailInput, "user@provider.com");
      // Check that the invalid email error is gone.
      await waitFor(() => {
        expect(screen.queryByText(/form:fields\.email\.errors\.invalid/)).toBeNull();
      });
    });
  });

  describe("sending form", () => {
    const forms = {
      "successfully submits": {
        form: { email: "user@provider.com", password: "123456" },
        responseStatus: 200,
        expectErrors: [],
      },
      "successfully submits with fields at size limit": {
        form: {
          email: ("a".repeat(BINDINGS_VALIDATION.EMAIL.MAX) + "@provider.com").slice(-BINDINGS_VALIDATION.EMAIL.MAX),
          password: "a".repeat(BINDINGS_VALIDATION.PASSWORD.MAX),
        },
        responseStatus: 200,
        expectErrors: [],
      },
      "sets password incorrect on forbidden error": {
        form: { email: "user@provider.com", password: "123456" },
        responseStatus: 403,
        expectErrors: [/form:fields\.password\.errors\.invalid/],
      },
      "sets email incorrect on not found error": {
        form: { email: "user@provider.com", password: "123456" },
        responseStatus: 404,
        expectErrors: [/form:fields\.email\.errors\.notFound/],
      },
      "sets global error on unknown error": {
        form: { email: "user@provider.com", password: "123456" },
        responseStatus: 500,
        expectErrors: [/authenticator\.login:form\.errors\.generic generic:error/],
      },
    };

    for (const [name, { form, responseStatus, expectErrors }] of Object.entries(forms)) {
      it(name, async () => {
        server.use(
          http
            .put("http://localhost:3000/session")
            .resolve(() =>
              HttpResponse.json(
                { accessToken: "access-token", refreshToken: "refresh-token" },
                { status: responseStatus }
              )
            )
        );

        const emailInput = screen.getByLabelText(/form:fields\.email\.label/) as HTMLInputElement;
        const passwordInput = screen.getByLabelText(/form:fields\.password\.label/) as HTMLInputElement;
        const submitButton = screen.getByText(/authenticator\.login:form\.submit/, {
          selector: "button",
        }) as HTMLButtonElement;

        await writeField(emailInput, form.email);
        await writeField(passwordInput, form.password);

        // Submit the form.
        act(() => {
          fireEvent.click(submitButton);
        });

        // Check the session context.
        await waitFor(() => {
          const sessionData = screen.getByTestId("session") as HTMLElement;
          expect(sessionData.innerHTML).toBe(
            expectErrors.length === 0
              ? JSON.stringify({ accessToken: "access-token", refreshToken: "refresh-token" })
              : ""
          );
        });

        // Check the form errors.
        await waitFor(() => {
          for (const error of expectErrors) {
            expect(screen.queryByText(error)).toBeDefined();
          }
        });

        expect(loginAction).toHaveBeenCalledTimes(expectErrors.length === 0 ? 1 : 0);
      });
    }
  });
});
