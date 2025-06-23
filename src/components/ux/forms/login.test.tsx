import { MockQueryClient } from "../../../../__test__/mocks/query_client";
import "../../../../__test__/mocks/react_it18next";
import { genericSetup } from "../../../../__test__/utils/setup";
import { QueryWrapperLight, StandardWrapper } from "../../../../__test__/utils/wrapper";
import { SessionProvider } from "../../../contexts";
import { TestSessionRenderer } from "../../../contexts/session.test";
import { LoginForm } from "../../ui/forms";
import { useLoginFormConnector } from "./login";

import { BINDINGS_VALIDATION } from "@a-novel/connector-authentication/api";

import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, fireEvent, render, renderHook, waitFor } from "@testing-library/react";
import nock from "nock";
import { describe, it, expect, vi } from "vitest";

let nockAPI: nock.Scope;

describe("LoginForm", () => {
  genericSetup({
    setNockAPI: (newScope) => {
      nockAPI = newScope;
    },
  });

  it("renders", async () => {
    const resetPasswordAction = vi.fn();
    const registerAction = vi.fn();
    const loginAction = vi.fn();

    const queryClient = new QueryClient(MockQueryClient);

    const loginFormConnector = renderHook((props) => useLoginFormConnector(props), {
      initialProps: { resetPasswordAction, registerAction, onLogin: loginAction },
      wrapper: QueryWrapperLight(queryClient),
    });

    const screen = render(<LoginForm connector={loginFormConnector.result.current} />, {
      wrapper: StandardWrapper,
    });

    expect(screen.getByLabelText(/login:fields\.email\.label/)).toBeDefined();
    expect(screen.getByLabelText(/login:fields\.password\.label/)).toBeDefined();

    const resetPasswordButton = screen.getByText(/login:fields\.password\.helper\.action/, { selector: "button" });
    expect(resetPasswordButton).toBeDefined();

    // Click on button to trigger the action.
    expect(resetPasswordAction).not.toHaveBeenCalled();
    act(() => {
      resetPasswordButton.click();
    });
    expect(resetPasswordAction).toHaveBeenCalled();

    const registerButton = screen.getByText(/login:form\.register\.action/, { selector: "button" });
    expect(registerButton).toBeDefined();

    // Click on button to trigger the action.
    expect(registerAction).not.toHaveBeenCalled();
    act(() => {
      registerButton.click();
    });
    expect(registerAction).toHaveBeenCalled();

    expect(loginAction).not.toHaveBeenCalled();
  });

  describe("form state", () => {
    const fields = [
      { name: "email", max: BINDINGS_VALIDATION.EMAIL.MAX },
      { name: "password", max: BINDINGS_VALIDATION.PASSWORD.MAX },
    ];

    for (const field of fields) {
      it(`prevents too large ${field.name} values`, async () => {
        const resetPasswordAction = vi.fn();
        const registerAction = vi.fn();
        const loginAction = vi.fn();

        const queryClient = new QueryClient(MockQueryClient);

        const loginFormConnector = renderHook((props) => useLoginFormConnector(props), {
          initialProps: { resetPasswordAction, registerAction, onLogin: loginAction },
          wrapper: QueryWrapperLight(queryClient),
        });

        const screen = render(<LoginForm connector={loginFormConnector.result.current} />, {
          wrapper: StandardWrapper,
        });

        const fieldInput = screen.getByLabelText(
          new RegExp(`login:fields\\.${field.name}\\.label`)
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
      const resetPasswordAction = vi.fn();
      const registerAction = vi.fn();
      const loginAction = vi.fn();

      const queryClient = new QueryClient(MockQueryClient);

      const loginFormConnector = renderHook((props) => useLoginFormConnector(props), {
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

      const screen = render(<LoginForm connector={loginFormConnector.result.current} />, { wrapper: StandardWrapper });

      const emailInput = screen.getByLabelText(/login:fields\.email\.label/) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/login:fields\.password\.label/) as HTMLInputElement;

      act(() => {
        fireEvent.change(emailInput, { target: { value: "" } });
        fireEvent.change(passwordInput, { target: { value: "" } });
      });

      await waitFor(() => {
        expect(screen.queryByText(/input:text\.errors\.tooShort.+login:fields\.email\.errors\.invalid/)).toBeDefined();
        expect(
          screen.queryByText(/input:text\.errors\.tooShort.+login:fields\.password\.errors\.invalid/)
        ).toBeDefined();
      });

      act(() => {
        fireEvent.change(emailInput, { target: { value: "a" } });
        fireEvent.change(passwordInput, { target: { value: "a" } });
      });

      await waitFor(() => {
        expect(screen.queryByText(/input:text\.errors\.tooShort.+login:fields\.email\.errors\.invalid/)).toBeDefined();
        expect(
          screen.queryByText(/input:text\.errors\.tooShort.+login:fields\.password\.errors\.invalid/)
        ).toBeDefined();
      });

      expect(loginAction).not.toHaveBeenCalled();
    });

    it("shows email invalid error", async () => {
      const resetPasswordAction = vi.fn();
      const registerAction = vi.fn();
      const loginAction = vi.fn();

      const queryClient = new QueryClient(MockQueryClient);

      const loginFormConnector = renderHook((props) => useLoginFormConnector(props), {
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

      const screen = render(<LoginForm connector={loginFormConnector.result.current} />, { wrapper: StandardWrapper });

      const emailInput = screen.getByLabelText(/login:fields\.email\.label/) as HTMLInputElement;

      act(() => {
        fireEvent.change(emailInput, { target: { value: "123456789" } });
      });

      await waitFor(() => {
        expect(screen.queryByText(/login:fields\.email\.errors\.invalid/)).toBeDefined();
      });

      expect(loginAction).not.toHaveBeenCalled();
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
        expectErrors: [/login:fields\.password\.errors\.invalid/],
      },
      "sets email incorrect on not found error": {
        form: { email: "user@provider.com", password: "123456" },
        responseStatus: 404,
        expectErrors: [/login:fields\.email\.errors\.notFound/],
      },
      "sets global error on unknown error": {
        form: { email: "user@provider.com", password: "123456" },
        responseStatus: 500,
        expectErrors: [/login:form\.errors\.generic/],
      },
    };

    for (const [name, { form, responseStatus, expectErrors }] of Object.entries(forms)) {
      it(name, async () => {
        const resetPasswordAction = vi.fn();
        const registerAction = vi.fn();
        const loginAction = vi.fn();

        const queryClient = new QueryClient(MockQueryClient);

        const loginFormConnector = renderHook((props) => useLoginFormConnector(props), {
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

        const screen = render(<LoginForm connector={loginFormConnector.result.current} />, {
          wrapper: StandardWrapper,
        });

        const nockLogin = nockAPI.put("/session", form).reply(responseStatus, { accessToken: "access-token" });

        const emailInput = screen.getByLabelText(/login:fields\.email\.label/) as HTMLInputElement;
        const passwordInput = screen.getByLabelText(/login:fields\.password\.label/) as HTMLInputElement;
        const submitButton = screen.getByText(/login:form\.submit/, { selector: "button" });

        // Update the fields with a normal value.
        act(() => {
          fireEvent.change(emailInput, { target: { value: form.email } });
          fireEvent.change(passwordInput, { target: { value: form.password } });
        });

        // Wait for the fields to update.
        await waitFor(() => {
          expect(emailInput.value).toBe(form.email);
          expect(passwordInput.value).toBe(form.password);
        });

        // Submit the form.
        act(() => {
          fireEvent.click(submitButton);
        });

        // Wait for the form to submit.
        await waitFor(() => {
          nockLogin.done();
        });

        if (expectErrors.length === 0) {
          // Check the session context.
          await waitFor(() => {
            const sessionData = screen.getByTestId("session");
            expect(sessionData.innerHTML).toBe(JSON.stringify({ accessToken: "access-token" }));
          });

          expect(loginAction).toHaveBeenCalled();
        } else {
          // Check the form errors.
          await waitFor(() => {
            for (const error of expectErrors) {
              expect(screen.queryByText(error)).toBeDefined();
            }
          });

          // Check the session context.
          await waitFor(() => {
            const sessionData = screen.getByTestId("session");
            expect(sessionData.innerHTML).toBe("");
          });

          expect(loginAction).not.toHaveBeenCalled();
        }
      });
    }
  });
});
