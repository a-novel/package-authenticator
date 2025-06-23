import { LoginForm, RequestRegisterForm, RequestResetPasswordForm } from "../components/ui/forms";
import { FormPage, type FormPageProps } from "../components/ui/pages";
import {
  useLoginFormConnector,
  useRequestRegisterFormConnector,
  useRequestResetPasswordFormConnector,
} from "../components/ux/forms";
import { i18nPKG } from "../shared/i18n";

import {
  type ComponentType,
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useTranslation } from "react-i18next";

export type AuthFormSelect = "login" | "register" | "resetPassword";

export interface AuthFormContextType {
  selectedForm: AuthFormSelect | undefined;
  selectForm: (form: AuthFormSelect | undefined) => void;
}

export const AuthFormContext = createContext<AuthFormContextType>({
  selectedForm: undefined,
  selectForm: () => {},
});

export interface AuthFormProviderProps extends Omit<FormPageProps, "children"> {
  children: ReactNode;
  layout?: ComponentType<{ children: ReactNode }>;
  setTitle?: (title: string | undefined) => void;
}

export const AuthFormProvider: FC<AuthFormProviderProps> = ({ children, layout: Layout, setTitle, ...props }) => {
  const { t } = useTranslation("form", { i18n: i18nPKG });

  const [showForm, setShowForm] = useState<AuthFormSelect>();

  const toLoginForm = useCallback(() => setShowForm("login"), []);
  const toRegisterForm = useCallback(() => setShowForm("register"), []);
  const toResetPasswordForm = useCallback(() => setShowForm("resetPassword"), []);
  const closeForm = useCallback(() => setShowForm(undefined), []);

  useEffect(() => {
    setTitle?.(showForm ? t(`form:title.${showForm}`) : undefined);
  }, [t, showForm, setTitle]);

  const loginFormConnector = useLoginFormConnector({
    resetPasswordAction: toResetPasswordForm,
    registerAction: toRegisterForm,
    onLogin: closeForm,
  });

  const requestRegisterFormConnector = useRequestRegisterFormConnector({
    loginAction: toLoginForm,
  });

  const requestResetPasswordFormConnector = useRequestResetPasswordFormConnector({
    loginAction: toLoginForm,
  });

  let actualChildren = children;
  switch (showForm) {
    case "login":
      actualChildren = (
        <FormPage {...props}>
          <LoginForm connector={loginFormConnector} />
        </FormPage>
      );
      break;
    case "register":
      actualChildren = (
        <FormPage {...props}>
          <RequestRegisterForm connector={requestRegisterFormConnector} />
        </FormPage>
      );
      break;
    case "resetPassword":
      actualChildren = (
        <FormPage {...props}>
          <RequestResetPasswordForm connector={requestResetPasswordFormConnector} />
        </FormPage>
      );
      break;
  }

  return (
    <AuthFormContext.Provider value={{ selectForm: setShowForm, selectedForm: showForm }}>
      {Layout ? <Layout>{actualChildren}</Layout> : actualChildren}
    </AuthFormContext.Provider>
  );
};

export const useAuthForm = () => useContext(AuthFormContext);
