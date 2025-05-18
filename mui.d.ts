import type { NeonUIButtonVariants } from "@a-novel/neon-ui";

import "@mui/material";

declare module "@mui/material" {
  //eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ButtonPropsVariantOverrides extends NeonUIButtonVariants {}
}
