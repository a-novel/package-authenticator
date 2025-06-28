import { vi } from "vitest";

const mergeKeyAndNs = (key: string, ns?: string | null) => (ns ? `${ns}:${key}` : key);

vi.mock("@tolgee/react", async (importOriginal: () => any) => {
  const original = await importOriginal();

  return {
    ...(original as any),
    useTranslate: vi.fn().mockImplementation(() => ({
      t: (key: string, data: { ns: string }) => JSON.stringify({ key: mergeKeyAndNs(key, data.ns), data }),
    })),
    T: ({ keyName, ns }: { keyName: string; ns: string; params: any }) =>
      JSON.stringify({ key: mergeKeyAndNs(keyName, ns) }),
    useTolgee: vi.fn().mockImplementation(() => ({
      addActiveNs: vi.fn().mockImplementation(() => Promise.resolve()),
      removeActiveNs: vi.fn(),
      getLanguage: vi.fn().mockImplementation(() => "en"),
      getPendingLanguage: vi.fn().mockImplementation(() => "en"),
    })),
  };
});
