import logo from "../../../assets/images/banner.png?inline";

import { SPACINGS } from "@a-novel/neon-ui";

import { type FC, type ReactNode } from "react";

import { Button, Stack, type StackProps } from "@mui/material";

export interface FormPageProps extends StackProps {
  cancel?: {
    action: () => void;
    node: ReactNode;
  };
}

export const FormPage: FC<FormPageProps> = ({ children, cancel, ...props }) => (
  <Stack
    component="main"
    direction="column"
    alignItems="center"
    justifyContent="center"
    flexGrow={1}
    gap={SPACINGS.XLARGE}
    padding={SPACINGS.MEDIUM}
    boxSizing="border-box"
    {...props}
  >
    <Stack direction="column" alignItems="center" justifyContent="center" flexGrow={1} gap={SPACINGS.LARGE}>
      <img style={{ width: "24rem", maxWidth: "75vw" }} src={logo} alt="a-novel logo" />
      {children}
    </Stack>

    {cancel && (
      <Button sx={{ alignSelf: "flex-start", maxWidth: "100%" }} onClick={cancel.action} color="primary">
        {cancel.node}
      </Button>
    )}
  </Stack>
);
