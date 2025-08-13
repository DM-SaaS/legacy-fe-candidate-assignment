import { describe, it, expect, beforeEach } from "vitest";
import { formatEVMAddress, saveToStorage, loadFromStorage } from "../helper";

describe("utils/helper", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("formatAddress returns shortened address", () => {
    const address = "0x1234567890abcdef1234567890abcdef12345678";
    const formatted = formatEVMAddress(address);
    expect(formatted).toBe("0x1234...5678");
  });

  it("formatAddress handles short addresses", () => {
    const address = "0x1234";
    const formatted = formatEVMAddress(address);
    expect(formatted).toBe("0x1234");
  });

  it("saveToStorage and loadFromStorage work correctly with objects", () => {
    const key = "testKey";
    const data = { hello: "world" };

    saveToStorage(key, data);
    const result = loadFromStorage(key);

    expect(result).toEqual(data);
  });

  it("returns null for non-existent keys", () => {
    expect(loadFromStorage("nonExistent")).toBeNull();
  });

  it("handles invalid JSON in localStorage", () => {
    localStorage.setItem("badKey", "{ invalid json }");
    expect(loadFromStorage("badKey")).toBeNull();
  });
});
