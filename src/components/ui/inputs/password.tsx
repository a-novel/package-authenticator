import { BINDINGS_VALIDATION } from "@a-novel/connector-authentication/api";
import { MaterialSymbol } from "@a-novel/neon-ui/ui";
import { TanstackTextField } from "@a-novel/neon-ui/ux";

import { type ReactNode, useState } from "react";

import { IconButton } from "@mui/material";
import { FieldApi } from "@tanstack/react-form";

export interface PasswordInputProps {
  field: FieldApi<any, any, string, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
  label: string;
  helperText?: ReactNode;
}

export const PasswordInput = ({ field, label, helperText }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TanstackTextField
      field={field}
      type={showPassword ? "text" : "password"}
      helperText={helperText}
      maxLength={BINDINGS_VALIDATION.PASSWORD.MAX}
      slotProps={{
        input: {
          endAdornment: (
            <IconButton onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <MaterialSymbol icon="visibility_off" /> : <MaterialSymbol icon="visibility" />}
            </IconButton>
          ),
        },
      }}
      label={
        <>
          <MaterialSymbol icon="password" />
          {label}
        </>
      }
    />
  );
};
