import { PopupForm, PopupFormFooter } from "./common";

import {
  BINDINGS_VALIDATION,
  RequestRegistrationForm as RequestRegistrationRequest,
} from "@a-novel/connector-authentication/api";
import { MaterialSymbol, Modal } from "@a-novel/package-ui/mui/components";
import { SPACINGS } from "@a-novel/package-ui/mui/utils";
import { type AnyReactFormWithData, EmailInput } from "@a-novel/package-ui/tanstack/form";
import { WithTolgeeNs } from "@a-novel/package-ui/translations";

import { type MouseEventHandler } from "react";

import { Button, Stack, Typography } from "@mui/material";
import { useStore } from "@tanstack/react-form";
import { T, useTranslate } from "@tolgee/react";
import { z } from "zod";

export interface RequestRegisterFormConnector {
  form: AnyReactFormWithData<z.infer<typeof RequestRegistrationRequest>>;
  loginAction: MouseEventHandler<HTMLButtonElement>;
}

export interface RequestRegisterFormProps {
  connector: RequestRegisterFormConnector;
}

function InnerRequestRegisterForm({ connector }: RequestRegisterFormProps) {
  const { t } = useTranslate("form");

  const isSubmitting = useStore(connector.form.store, (state) => state.isSubmitting);
  const isSubmitSuccessful = useStore(connector.form.store, (state) => state.isSubmitSuccessful);
  const userEmail = useStore(connector.form.store, (state) => state.values.email);

  return (
    <>
      <PopupForm
        form={connector.form}
        submitButton={<T keyName={isSubmitting ? "form.submitting" : "form.submit"} ns="authenticator.register" />}
        footer={
          <PopupFormFooter>
            <Typography textAlign="center">
              <span>
                <T keyName="form.login.label" ns="authenticator.register" />{" "}
              </span>
              <Button variant="text" type="button" color="primary" onClick={connector.loginAction}>
                <T keyName="form.login.action" ns="authenticator.register" />
              </Button>
            </Typography>
          </PopupFormFooter>
        }
      >
        <connector.form.Field name="email">
          {(field) => (
            <EmailInput
              field={field}
              label={<T keyName="fields.email.label" ns="form" />}
              placeholder={t("fields.email.placeholder", { ns: "form" })}
              helperText={<T keyName="fields.email.helper" ns="authenticator.register" />}
              maxLength={BINDINGS_VALIDATION.EMAIL.MAX}
            />
          )}
        </connector.form.Field>
      </PopupForm>

      <Modal
        title={<T keyName="form.success.title" ns="authenticator.register" />}
        icon={<MaterialSymbol icon="mark_email_read" />}
        open={isSubmitSuccessful}
      >
        <Typography sx={{ "> strong": { color: (theme) => theme.palette.primary.main } }}>
          <T keyName="form.success.main" ns="authenticator.register" params={{ mail: userEmail, strong: <strong /> }} />
        </Typography>
        <br />
        <Typography color="textSecondary">
          <T keyName="form.success.sub" ns="authenticator.register" />
        </Typography>
        <br />
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={SPACINGS.MEDIUM}>
          <Button type="button" color="primary" onClick={connector.loginAction}>
            <T keyName="form.success.action" ns="authenticator.register" />
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export const RequestRegisterForm = WithTolgeeNs(InnerRequestRegisterForm, ["authenticator.register", "form"]);
