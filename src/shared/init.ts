import socialLogo from "~/assets/images/banner.png";

import { Context } from "./context";

export interface InitProps {
  logoURL?: string;
}

export const init = (props: InitProps) => {
  Context.agoraPackageAuthenticator = {
    logoURL: props.logoURL || socialLogo,
  };
};
