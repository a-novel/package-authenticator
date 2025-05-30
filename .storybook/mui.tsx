import { theme } from "@a-novel/neon-ui";

import { CssBaseline, ThemeProvider } from "@mui/material";
import type { Decorator } from "@storybook/react-vite";

export const WithMui: Decorator = (Story, context) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Story {...context} />
  </ThemeProvider>
);
