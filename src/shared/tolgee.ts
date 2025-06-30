import { LangEnum } from "@a-novel/connector-authentication/api";

import { useEffect } from "react";

import { type NsFallback, useTolgee } from "@tolgee/react";

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

export const useTolgeeNamespaces = (ns: NsFallback) => {
  const { addActiveNs, removeActiveNs } = useTolgee();

  // Load / unload translations.
  useEffect(() => {
    addActiveNs(ns).then();
    return () => removeActiveNs(ns);
  }, [addActiveNs, removeActiveNs, ns]);
};
