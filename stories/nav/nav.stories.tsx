import logo from "../../src/assets/images/banner.png";

import { AuthNavDesktopAction, AuthNavMobileAction } from "../../src/components/ui/nav";

import { SPACINGS, NavBar } from "@a-novel/neon-ui";

import { Stack, Typography } from "@mui/material";
import { type Meta, type StoryObj } from "@storybook/react";

const meta: Meta<typeof AuthNavDesktopAction> = {
  component: AuthNavDesktopAction,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  render: (args) => (
    <Stack
      direction="column"
      gap={SPACINGS.LARGE}
      padding={0}
      minHeight="100vh"
      boxSizing="border-box"
      overflow="visible"
    >
      <NavBar
        homeButton={{ icon: logo }}
        lang={{
          langs: {
            en: {
              displayCode: "ENG",
              flag: "us",
              label: "English",
            },
            fr: {
              displayCode: "FRA",
              flag: "fr",
              label: "Français",
            },
          },
          selectedLang: "fr",
          onChange: () => null,
        }}
        desktopActions={<AuthNavDesktopAction {...args} />}
        mobileActions={<AuthNavMobileAction {...args} />}
      />
      <Typography padding="1rem">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </Typography>
    </Stack>
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

export const Authenticated: Story = {
  args: {
    user: {
      data: {
        email: "user@provider.com",
      },
    },
  },
};

export const VeryLongName: Story = {
  args: {
    user: {
      data: {
        email:
          "superLongUserNameWithSoManyWordsItWillBlowYourMindBecauseHonestlyThisIsSoAmazingLol@qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm.com",
      },
    },
  },
};

export const UserLoading: Story = {
  args: {
    user: {
      loading: true,
    },
  },
};

export const UserError: Story = {
  args: {
    user: {
      error: true,
    },
  },
};
