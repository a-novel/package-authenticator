import { LangEnum } from "@a-novel/connector-authentication/api";

import i18n from "i18next";
import LocizeBackend from "i18next-locize-backend";
import { initReactI18next } from "react-i18next";

const locizeOptions = {
  projectId: "fce6deff-96ef-48f8-9e9e-8918867471f1",
  referenceLng: "fr",
};

const i18nPKG: typeof i18n = i18n.createInstance();

i18nPKG
  .use(LocizeBackend)
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    backend: locizeOptions,
  })
  .finally();

export { i18nPKG };

/**
 * Extract a form-supported language from the i18n instance.
 */
export const getLang = (): LangEnum => {
  switch (i18n.language) {
    case "en":
      return LangEnum.En;
    case "fr":
      return LangEnum.Fr;
    default:
      return LangEnum.En;
  }
};
