import { MockQueryClient } from "../../../../__test__/mocks/query_client";
import "../../../../__test__/mocks/react_it18next";
import { genericSetup } from "../../../../__test__/utils/setup";
import { QueryWrapperLight, StandardWrapper } from "../../../../__test__/utils/wrapper";
import { SESSION_STORAGE_KEY } from "../../../contexts";
import { RequestResetPasswordForm } from "../../ui/forms";
import { useRequestResetPasswordFormConnector } from "./request_reset_password";

import { BINDINGS_VALIDATION, LangEnum } from "@a-novel/connector-authentication/api";

import { QueryClient } from "@tanstack/react-query";
import { act, fireEvent, render, renderHook, waitFor } from "@testing-library/react";
import nock from "nock";
import { describe, expect, it, vi } from "vitest";

let nockAPI: nock.Scope;

describe("RequestResetPasswordForm", () => {
  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("renders", async () => {
    const loginAction = vi.fn();

    const queryClient = new QueryClient(MockQueryClient);

    const requestResetPasswordFormConnector = renderHook((props) => useRequestResetPasswordFormConnector(props), {
      initialProps: { loginAction },
      wrapper: QueryWrapperLight(queryClient),
    });

    const screen = render(<RequestResetPasswordForm connector={requestResetPasswordFormConnector.result.current} />, {
      wrapper: StandardWrapper,
    });

    expect(screen.getByLabelText(/resetPassword:fields\.email\.label/)).toBeDefined();

    const loginButton = screen.getByText(/resetPassword:form\.backToLogin\.action/, { selector: "button" });
    expect(loginButton).toBeDefined();

    // Click on button to trigger the action.
    expect(loginAction).not.toHaveBeenCalled();
    act(() => {
      loginButton.click();
    });
    expect(loginAction).toHaveBeenCalled();
  });

  describe("form state", () => {
    const fields = [{ name: "email", max: BINDINGS_VALIDATION.EMAIL.MAX }];

    for (const field of fields) {
      it(`prevents too large ${field.name} values`, async () => {
        const loginAction = vi.fn();

        const queryClient = new QueryClient(MockQueryClient);

        const requestResetPasswordFormConnector = renderHook((props) => useRequestResetPasswordFormConnector(props), {
          initialProps: { loginAction },
          wrapper: QueryWrapperLight(queryClient),
        });

        const screen = render(
          <RequestResetPasswordForm connector={requestResetPasswordFormConnector.result.current} />,
          {
            wrapper: StandardWrapper,
          }
        );

        const fieldInput = screen.getByLabelText(
          new RegExp(`resetPassword:fields\\.${field.name}\\.label`)
        ) as HTMLInputElement;
        expect(fieldInput).toBeDefined();

        // Update the fields with a normal value.
        act(() => {
          fireEvent.change(fieldInput, { target: { value: "abc" } });
        });

        await waitFor(() => {
          expect(fieldInput.value).toBe("abc");
          expect(screen.queryAllByText(/this field has reached its limit of/i)).length(0);
        });

        // Update the fields with a too long value.
        act(() => {
          fireEvent.change(fieldInput, { target: { value: "a".repeat(field.max * 2) } });
        });

        await waitFor(() => {
          expect(fieldInput.value).toBe("a".repeat(field.max));
          expect(screen.queryAllByText(/this field has reached its limit of/i)).length(1);
        });

        // Reverse the fields to a normal value.
        act(() => {
          fireEvent.change(fieldInput, { target: { value: "abc" } });
        });

        await waitFor(() => {
          expect(fieldInput.value).toBe("abc");
          expect(screen.queryAllByText(/this field has reached its limit of/i)).length(0);
        });
      });
    }
  });

  describe("validating form", () => {
    it("shows fields too short error", async () => {
      const loginAction = vi.fn();

      const queryClient = new QueryClient(MockQueryClient);

      const requestResetPasswordFormConnector = renderHook((props) => useRequestResetPasswordFormConnector(props), {
        initialProps: { loginAction },
        wrapper: QueryWrapperLight(queryClient),
      });

      const screen = render(<RequestResetPasswordForm connector={requestResetPasswordFormConnector.result.current} />, {
        wrapper: StandardWrapper,
      });

      const emailInput = screen.getByLabelText(/resetPassword:fields\.email\.label/) as HTMLInputElement;

      act(() => {
        fireEvent.change(emailInput, { target: { value: "" } });
      });

      await waitFor(() => {
        expect(
          screen.queryByText(/input:text\.errors\.tooShort.+resetPassword:fields\.email\.errors\.invalid/)
        ).toBeDefined();
      });

      act(() => {
        fireEvent.change(emailInput, { target: { value: "a" } });
      });

      await waitFor(() => {
        expect(
          screen.queryByText(/input:text\.errors\.tooShort.+resetPassword:fields\.email\.errors\.invalid/)
        ).toBeDefined();
      });
    });

    it("shows email invalid error", async () => {
      const loginAction = vi.fn();

      const queryClient = new QueryClient(MockQueryClient);

      const requestResetPasswordFormConnector = renderHook((props) => useRequestResetPasswordFormConnector(props), {
        initialProps: { loginAction },
        wrapper: QueryWrapperLight(queryClient),
      });

      const screen = render(<RequestResetPasswordForm connector={requestResetPasswordFormConnector.result.current} />, {
        wrapper: StandardWrapper,
      });

      const emailInput = screen.getByLabelText(/resetPassword:fields\.email\.label/) as HTMLInputElement;

      act(() => {
        fireEvent.change(emailInput, { target: { value: "123456789" } });
      });

      await waitFor(() => {
        expect(screen.queryByText(/resetPassword:fields\.email\.errors\.invalid/)).toBeDefined();
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
        expectErrors: [/resetPassword:fields\.email\.errors\.notFound/],
      },
      "sets global error on unknown error": {
        form: { email: "user@provider.com" },
        responseStatus: 500,
        expectErrors: [/resetPassword:form\.errors\.generic/],
      },
    };

    for (const [name, { form, responseStatus, expectErrors }] of Object.entries(forms)) {
      it(name, async () => {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ accessToken: "anon-access-token" }));

        const loginAction = vi.fn();

        const queryClient = new QueryClient(MockQueryClient);

        const requestResetPasswordFormConnector = renderHook((props) => useRequestResetPasswordFormConnector(props), {
          initialProps: { loginAction },
          wrapper: QueryWrapperLight(queryClient),
        });

        const screen = render(
          <RequestResetPasswordForm connector={requestResetPasswordFormConnector.result.current} />,
          {
            wrapper: StandardWrapper,
          }
        );

        const nockResetPassword = nockAPI
          .put(
            "/short-code/update-password",
            { ...form, lang: LangEnum.En },
            { reqheaders: { Authorization: "Bearer anon-access-token" } }
          )
          .reply(responseStatus);

        const emailInput = screen.getByLabelText(/resetPassword:fields\.email\.label/) as HTMLInputElement;
        const submitButton = screen.getByText(/resetPassword:form\.submit/, { selector: "button" });

        // Update the fields with a normal value.
        act(() => {
          fireEvent.change(emailInput, { target: { value: form.email } });
        });

        // Wait for the fields to update.
        await waitFor(() => {
          expect(emailInput.value).toBe(form.email);
        });

        // Submit the form.
        act(() => {
          fireEvent.click(submitButton);
        });

        // Wait for the form to submit.
        await waitFor(() => {
          nockResetPassword.done();
        });

        if (expectErrors.length === 0) {
          // Check the session context.
          await waitFor(() => {
            expect(screen.queryByText(/resetPassword:success\.title/)).toBeDefined();
            expect(screen.queryByText(/resetPassword:success\.main/)).toBeDefined();
            expect(screen.queryByText(/resetPassword:success\.sub/)).toBeDefined();
          });
        } else {
          // Check the form errors.
          await waitFor(() => {
            for (const error of expectErrors) {
              expect(screen.queryByText(error)).toBeDefined();
            }
          });
        }
      });
    }
  });
});
