import { theme } from "@a-novel/package-ui/mui";

import type { FC, ReactNode } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const StandardWrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
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
