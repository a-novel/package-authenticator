declare module "*.yaml" {
  const value: Record<string, unknown>;
  export default value;
}

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
}
