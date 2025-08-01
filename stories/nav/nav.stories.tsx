import logo from "~/assets/images/banner.png";

import { AuthNavDesktopAction, AuthNavMobileAction } from "~/components/nav";

import { CredentialsRoleEnum } from "@a-novel/connector-authentication/api";
import { NavBar } from "@a-novel/package-ui/mui/components";
import { SPACINGS } from "@a-novel/package-ui/mui/utils";

import { Stack, Typography } from "@mui/material";
import { type Meta, type StoryObj } from "@storybook/react-vite";

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
              shortLabel: "ENG",
              flag: "us",
              label: "English",
            },
            fr: {
              shortLabel: "FRA",
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
      loading: false,
      error: false,
      data: {
        id: "1234567890",
        email: "user@provider.com",
        role: CredentialsRoleEnum.User,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },
};

export const VeryLongName: Story = {
  args: {
    user: {
      loading: false,
      error: false,
      data: {
        id: "1234567890",
        email:
          "superLongUserNameWithSoManyWordsItWillBlowYourMindBecauseHonestlyThisIsSoAmazingLol@qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm.com",
        role: CredentialsRoleEnum.User,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },
};

export const UserLoading: Story = {
  args: {
    user: {
      error: false,
      loading: true,
    },
  },
};

export const UserError: Story = {
  args: {
    user: {
      loading: false,
      error: true,
    },
  },
};
