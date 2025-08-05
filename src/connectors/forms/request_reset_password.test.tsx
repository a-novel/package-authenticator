import "#/mocks/tolgee";
import { server } from "#/utils/setup";
import { QueryWrapperLight, StandardWrapper } from "#/utils/wrapper";

import { RequestResetPasswordForm, type RequestResetPasswordFormConnector } from "~/components/forms";
import { SESSION_STORAGE_KEY } from "~/contexts";

import { useRequestResetPasswordFormConnector } from "./request_reset_password";

import { BINDINGS_VALIDATION, LangEnum } from "@a-novel/connector-authentication/api";
import { MockQueryClient } from "@a-novel/nodelib/mocks/query_client";
import { http } from "@a-novel/nodelib/msw";
import { writeField } from "@a-novel/nodelib/test/form";

import { QueryClient } from "@tanstack/react-query";
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
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

let requestRegisterFormConnector: RenderHookResult<
  RequestResetPasswordFormConnector,
  {
    loginAction: Mock<any>;
  }
>;
let screen: RenderResult;

let queryClient: QueryClient;

const loginAction = vi.fn();

describe("RequestResetPasswordForm", () => {
  beforeEach(() => {
    queryClient = new QueryClient(MockQueryClient);

    // Render the hook, then inject the connector into the form.
    requestRegisterFormConnector = renderHook((props) => useRequestResetPasswordFormConnector(props), {
      initialProps: { loginAction },
      wrapper: QueryWrapperLight(queryClient),
    });

    screen = render(<RequestResetPasswordForm connector={requestRegisterFormConnector.result.current} />, {
      wrapper: StandardWrapper,
    });
  });

  // Ensure the login form renders every field, and all of them are enabled.
  describe("renders", async () => {
    // Verify inputs are rendered.
    const inputs = [/form:fields\.email\.label/];

    for (const label of inputs) {
      it(`renders input with label ${label}`, () => {
        const input = screen.getByLabelText(label) as HTMLInputElement;
        expect(input).toBeDefined();
        expect((input as HTMLInputElement).disabled).toBe(false);
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
        form: { email: "user@provider.com" },
        responseStatus: 204,
        expectErrors: [],
      },
      "successfully submits with fields at size limit": {
        form: {
          email: ("a".repeat(BINDINGS_VALIDATION.EMAIL.MAX) + "@provider.com").slice(-BINDINGS_VALIDATION.EMAIL.MAX),
        },
        responseStatus: 204,
        expectErrors: [],
      },
      "sets email incorrect on not found error": {
        form: { email: "user@provider.com" },
        responseStatus: 404,
        expectErrors: [/form:fields\.email\.errors\.notFound/],
      },
      "sets global error on unknown error": {
        form: { email: "user@provider.com" },
        responseStatus: 500,
        expectErrors: [/authenticator\.resetPassword:form\.errors\.generic/],
      },
    };

    for (const [name, { form, responseStatus, expectErrors }] of Object.entries(forms)) {
      it(name, async () => {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ accessToken: "anon-access-token" }));

        server.use(
          http
            .put("http://localhost:3000/short-code/update-password")
            .headers(new Headers({ Authorization: "Bearer anon-access-token" }), HttpResponse.error())
            .bodyJSON({ ...form, lang: LangEnum.En }, HttpResponse.error())
            .resolve(() => HttpResponse.json(undefined, { status: responseStatus }))
        );

        const emailInput = screen.getByLabelText(/form:fields\.email\.label/) as HTMLInputElement;
        const submitButton = screen.getByText(/authenticator\.resetPassword:form\.submit/, { selector: "button" });

        // Update the fields with a normal value.
        await writeField(emailInput, form.email);

        // Submit the form.
        act(() => {
          fireEvent.click(submitButton);
        });

        // Check the form errors.
        await waitFor(() => {
          for (const error of expectErrors) {
            expect(screen.getByText(error)).toBeDefined();
          }
        });

        if (expectErrors.length === 0) {
          // Check the session context.
          await waitFor(() => {
            expect(screen.getByText(/authenticator\.resetPassword:form\.success\.title/)).toBeDefined();
            expect(screen.getByText(/authenticator\.resetPassword:form\.success\.main/)).toBeDefined();
            expect(screen.getByText(/authenticator\.resetPassword:form\.success\.sub/)).toBeDefined();
          });
        } else {
          // If there are errors, the success modal should not be displayed.
          expect(screen.queryByText(/authenticator\.resetPassword:form\.success\.title/)).toBeNull();
          expect(screen.queryByText(/authenticator\.resetPassword:form\.success\.main/)).toBeNull();
          expect(screen.queryByText(/authenticator\.resetPassword:form\.success\.sub/)).toBeNull();
        }
      });
    }
  });
});
