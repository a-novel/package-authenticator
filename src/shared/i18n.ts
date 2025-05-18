// This instance loads translations for the auth component. As it is meant to be imported into external projects, and
// to avoid disruption as much as possible, translations must be loaded seamlessly.
// That's why we don't use the http backend optimization, but load translations synchronously. Keep in mind this only
// loads the translation used by the auth component and its dependencies, NOT the standalone website.
import formEn from "../assets/locales/en/form.yaml";
import inputEn from "../assets/locales/en/input.yaml";
import loginEn from "../assets/locales/en/login.yaml";
import navEn from "../assets/locales/en/nav.yaml";
import registerEn from "../assets/locales/en/register.yaml";
import resetPasswordEn from "../assets/locales/en/reset-password.yaml";
import sessionEn from "../assets/locales/en/session.yaml";
import formFr from "../assets/locales/fr/form.yaml";
import inputFr from "../assets/locales/fr/input.yaml";
import loginFr from "../assets/locales/fr/login.yaml";
import navFr from "../assets/locales/fr/nav.yaml";
import registerFr from "../assets/locales/fr/register.yaml";
import resetPasswordFr from "../assets/locales/fr/reset-password.yaml";
import sessionFr from "../assets/locales/fr/session.yaml";

import { LangEnum } from "@a-novel/connector-authentication/api";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const i18nPKG: typeof i18n = i18n.createInstance();

i18nPKG
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: "en",

    supportedLngs: ["en", "fr"],

    resources: {
      en: {
        input: inputEn,
        login: loginEn,
        register: registerEn,
        resetPassword: resetPasswordEn,
        session: sessionEn,
        form: formEn,
        nav: navEn,
      },
      fr: {
        input: inputFr,
        login: loginFr,
        register: registerFr,
        resetPassword: resetPasswordFr,
        session: sessionFr,
        form: formFr,
        nav: navFr,
      },
    },

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
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
