import type { AgoraUIButtonPropsVariant } from "@a-novel/package-ui/mui";

import "@mui/material";

declare module "@mui/material" {
  //eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ButtonPropsVariantOverrides extends AgoraUIButtonPropsVariant {}
}
