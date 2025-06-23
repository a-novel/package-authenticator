import { i18nPKG } from "../../src/shared/i18n";

import { theme } from "@a-novel/neon-ui";

import type { FC, ReactNode } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";

export const StandardWrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <I18nextProvider i18n={i18nPKG}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </I18nextProvider>
);

export const QueryWrapper = (queryClient: QueryClient) =>
  function InnerQueryWrapper({ children }: { children: ReactNode }) {
    return (
      <StandardWrapper>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </StandardWrapper>
    );
  };

export const QueryWrapperLight = (queryClient: QueryClient) =>
  function InnerQueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
