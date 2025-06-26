import { MockReplyHeaders } from "#/mocks/query_client";

import { init } from "../../src";

import nock from "nock";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";

export interface GenericSetupProps {
  setNockAPI?: (scope: nock.Scope) => void;
}

beforeAll(() => {
  init({ authURL: "http://localhost:8081" });

  if (!nock.isActive()) nock.activate();

  nock.emitter.on("no match", (req) => {
    throw new Error(`Unexpected request was sent to ${req.method} ${req.path}`);
  });
});

afterAll(() => {
  nock.restore();
});

export const genericSetup = (props: GenericSetupProps) => {
  beforeEach(() => {
    // Objects are passed by reference in javascript, so this will update the actual value from the source.
    props.setNockAPI?.(nock("http://localhost:8081").defaultReplyHeaders(MockReplyHeaders));
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    nock.cleanAll();
  });
};
