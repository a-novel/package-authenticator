import { User } from "@a-novel/connector-authentication/api";

import { z } from "zod";

export interface AuthNavDisplayProps {
  user?: {
    data?: z.infer<typeof User>;
    loading: boolean;
    error: boolean;
  };
  login: () => void;
  register: () => void;
  logout: () => void;
  manageAccount: () => void;
}
