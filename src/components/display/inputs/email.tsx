import { ReactComponent as GearLoader } from "../../../assets/icons/spinners/gear.svg";

import { useInputStatus, RenderFieldErrors, RenderTooLongWarning } from "./tanstack_connector";

import { BINDINGS_VALIDATION } from "@a-novel/connector-authentication/api";
import { SPACINGS, MaterialSymbol } from "@a-novel/neon-ui";

import type { FC } from "react";

import { IconButton, Stack, TextField } from "@mui/material";
import { FieldApi, useStore } from "@tanstack/react-form";

export interface EmailInputProps {
  field: FieldApi<any, any, string, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>;
  label: string;
  placeholder: string;
}

export const EmailInput: FC<EmailInputProps> = ({ field, label, placeholder }) => {
  const status = useInputStatus(field);

  const isSubmitting = useStore(field.form.store, (state) => state.isSubmitting);
  const isValidating = useStore(field.store, (state) => state.meta.isValidating);

  return (
    <Stack direction="column" gap={SPACINGS.SMALL}>
      <TextField
        id={field.name}
        label={
          <>
            <MaterialSymbol icon="mail" />
            {label}
          </>
        }
        error={status === "error"}
        type="email"
        placeholder={placeholder}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value.substring(0, BINDINGS_VALIDATION.EMAIL.MAX))}
        disabled={isSubmitting}
        slotProps={{
          htmlInput: { maxLength: BINDINGS_VALIDATION.EMAIL.MAX },
          input: {
            endAdornment: isValidating ? (
              <IconButton sx={{ pointerEvents: "none" }}>
                <GearLoader />
              </IconButton>
            ) : undefined,
          },
        }}
      />
      <RenderTooLongWarning field={field} maxLength={BINDINGS_VALIDATION.EMAIL.MAX} />
      <RenderFieldErrors field={field} />
    </Stack>
  );
};
