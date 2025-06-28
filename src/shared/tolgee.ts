import { LangEnum } from "@a-novel/connector-authentication/api";

export const getLang = (lang: string): LangEnum => {
  switch (lang) {
    case "en":
      return LangEnum.En;
    case "fr":
      return LangEnum.Fr;
    default:
      return LangEnum.En; // Default to English if no match
  }
};
