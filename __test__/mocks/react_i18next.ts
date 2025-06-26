import { vi } from "vitest";

vi.mock("react-i18next", async (importOriginal: () => any) => {
  const original = await importOriginal();

  return {
    ...(original as any),
    useTranslation: vi.fn().mockImplementation(() => ({
      t: (key: string, data: any) => JSON.stringify({ key, data }),
    })),
    Translation: ({ children }: { children: any }) =>
      children((key: string, data: any) => JSON.stringify({ key, data })),
  };
});
