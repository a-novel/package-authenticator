import { i18nPKG } from "../src/shared/i18n";

import { Suspense, useEffect } from "react";

import type { Decorator } from "@storybook/react-vite";
import { I18nextProvider } from "react-i18next";

export const WithI18next: Decorator = (Story, context) => {
  const { locale } = context.globals;

  // When the locale global changes
  // Set the new locale in i18n
  useEffect(() => {
    i18nPKG.changeLanguage(locale).catch(console.error);
  }, [locale]);

  return (
    <Suspense fallback={<div>loading translations...</div>}>
      <I18nextProvider i18n={i18nPKG}>
        <Story {...context} />
      </I18nextProvider>
    </Suspense>
  );
};
