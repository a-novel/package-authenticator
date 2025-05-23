import { ReactComponent as GearLoader } from "../../../assets/icons/spinners/gear.svg";

import { BINDINGS_VALIDATION } from "@a-novel/connector-authentication/api";
import { MaterialSymbol } from "@a-novel/neon-ui/ui";
import { TanstackTextField } from "@a-novel/neon-ui/ux";

import type { FC } from "react";

import { IconButton } from "@mui/material";
import { FieldApi, useStore } from "@tanstack/react-form";

export interface EmailInputProps {
  field: FieldApi<any, any, string, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
  label: string;
  placeholder: string;
}

export const EmailInput: FC<EmailInputProps> = ({ field, label, placeholder }) => {
  const isValidating = useStore(field.store, (state) => state.meta.isValidating);

  return (
    <TanstackTextField
      field={field}
      type="email"
      placeholder={placeholder}
      maxLength={BINDINGS_VALIDATION.EMAIL.MAX}
      slotProps={{
        input: {
          endAdornment: isValidating ? (
            <IconButton sx={{ pointerEvents: "none" }}>
              <GearLoader />
            </IconButton>
          ) : undefined,
        },
      }}
      label={
        <>
          <MaterialSymbol icon="mail" />
          {label}
        </>
      }
    />
  );
};
