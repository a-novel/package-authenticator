import { theme } from "@a-novel/package-ui/mui";

import { CssBaseline, ThemeProvider } from "@mui/material";
import type { Decorator } from "@storybook/react-vite";

export const MuiDecorator: Decorator = (Story, context) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Story {...context} />
  </ThemeProvider>
);
