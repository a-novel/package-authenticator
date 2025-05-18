import { User } from "@a-novel/connector-authentication/api";

import { z } from "zod";

export interface AuthNavProps {
  user?: z.infer<typeof User>;
  userLoading?: boolean;
  userError?: boolean;
  login: () => void;
  register: () => void;
  logout: () => void;
  manageAccount: () => void;
}
