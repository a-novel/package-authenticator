import { LoginForm, RequestRegisterForm, RequestResetPasswordForm } from "~/components/forms";
import { FormPage, type FormPageProps } from "~/components/pages";
import {
  useLoginFormConnector,
  useRequestRegisterFormConnector,
  useRequestResetPasswordFormConnector,
} from "~/connectors/forms";
import { useTolgeeNamespaces } from "~/shared";

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

import { useTranslate } from "@tolgee/react";

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

const FORM_TITLES = {
  login: {
    key: "metadata.title",
    ns: "authenticator.login",
  },
  register: {
    key: "metadata.title",
    ns: "authenticator.register",
  },
  resetPassword: {
    key: "metadata.title",
    ns: "authenticator.resetPassword",
  },
};

const ns = ["authenticator.login", "authenticator.register", "authenticator.resetPassword"];

export const AuthFormProvider: FC<AuthFormProviderProps> = ({ children, layout: Layout, setTitle, ...props }) => {
  const { t } = useTranslate(ns);
  useTolgeeNamespaces(ns);

  const [showForm, setShowForm] = useState<AuthFormSelect>();

  const toLoginForm = useCallback(() => setShowForm("login"), []);
  const toRegisterForm = useCallback(() => setShowForm("register"), []);
  const toResetPasswordForm = useCallback(() => setShowForm("resetPassword"), []);
  const closeForm = useCallback(() => setShowForm(undefined), []);

  useEffect(() => {
    setTitle?.(showForm ? t(FORM_TITLES[showForm].key, { ns: FORM_TITLES[showForm].ns }) : undefined);
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
