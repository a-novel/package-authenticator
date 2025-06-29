import { User } from "@a-novel/connector-authentication/api";

import type { ElementType } from "react";

import type { ButtonProps, ButtonTypeMap } from "@mui/material";
import { z } from "zod";

export interface AuthNavDisplayProps<
  LoginButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  RegisterButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  LogoutButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
  ManageAccountButtonProps extends ElementType = ButtonTypeMap["defaultComponent"],
> {
  user?: {
    data?: z.infer<typeof User>;
    loading: boolean;
    error: boolean;
  };
  login: Omit<ButtonProps<LoginButtonProps>, "children" | "variant" | "color" | "sx">;
  register: Omit<ButtonProps<RegisterButtonProps>, "children" | "variant" | "color" | "sx">;
  logout: Omit<ButtonProps<LogoutButtonProps>, "children" | "variant" | "color" | "sx">;
  account: Omit<ButtonProps<ManageAccountButtonProps>, "children" | "variant" | "color" | "sx">;
}
