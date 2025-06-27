import { act, fireEvent, waitFor } from "@testing-library/react";
import { expect } from "vitest";

export const writeField = async (field: HTMLElement, value: string, expectValue: string = value) => {
  act(() => {
    fireEvent.blur(field);
    fireEvent.change(field, { target: { value: value } });
    fireEvent.blur(field);
  });

  await waitFor(() => {
    expect((field as HTMLInputElement).value).toBe(expectValue);
  });
};
