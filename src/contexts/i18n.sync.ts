import { i18nPKG as i18nPKGSrc } from "../shared/i18n";

import { type FC, useEffect } from "react";

import { useTranslation } from "react-i18next";

/**
 * Sync the local i18n instance with a higher-level one.
 */
export const SyncI18n: FC = () => {
  const { i18n } = useTranslation();
  const { i18n: i18nPkg } = useTranslation(undefined, { i18n: i18nPKGSrc });

  const { changeLanguage } = i18nPkg;

  useEffect(() => {
    changeLanguage(i18n.language).catch(console.error);
  }, [changeLanguage, i18n.language]);

  return null;
};
