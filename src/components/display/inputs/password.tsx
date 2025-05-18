import { useInputStatus, RenderFieldErrors, RenderTooLongWarning } from "./tanstack_connector";

import { BINDINGS_VALIDATION } from "@a-novel/connector-authentication/api";
import { SPACINGS, MaterialSymbol } from "@a-novel/neon-ui";

import { type ReactNode, useState } from "react";

import { IconButton, Stack, TextField } from "@mui/material";
import { FieldApi, useStore } from "@tanstack/react-form";

export interface PasswordInputProps {
  field: FieldApi<any, any, string, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
  label: string;
  helperText?: ReactNode;
}

export const PasswordInput = ({ field, label, helperText }: PasswordInputProps) => {
  const status = useInputStatus(field);

  const isSubmitting = useStore(field.form.store, (state) => state.isSubmitting);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Stack direction="column" gap={SPACINGS.SMALL}>
      <TextField
        id={field.name}
        label={
          <>
            <MaterialSymbol icon="password" />
            {label}
          </>
        }
        helperText={helperText}
        error={status === "error"}
        type={showPassword ? "text" : "password"}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value.substring(0, BINDINGS_VALIDATION.PASSWORD.MAX))}
        disabled={isSubmitting}
        slotProps={{
          htmlInput: { maxLength: BINDINGS_VALIDATION.PASSWORD.MAX },
          input: {
            endAdornment: (
              <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <MaterialSymbol icon="visibility_off" /> : <MaterialSymbol icon="visibility" />}
              </IconButton>
            ),
          },
        }}
      />
      <RenderTooLongWarning field={field} maxLength={BINDINGS_VALIDATION.PASSWORD.MAX} />
      <RenderFieldErrors field={field} />
    </Stack>
  );
};
