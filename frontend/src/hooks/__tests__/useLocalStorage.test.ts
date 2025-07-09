import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useLocalStorage } from "../useLocalStorage";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

describe("useLocalStorage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial value when localStorage is empty", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    expect(result.current[0]).toBe("initial");
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith("test-key");
  });

  it("should return stored value when localStorage has data", () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify("stored-value"));

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    expect(result.current[0]).toBe("stored-value");
  });

  it("should handle JSON parse errors gracefully", () => {
    mockLocalStorage.getItem.mockReturnValue("invalid-json");
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    expect(result.current[0]).toBe("initial");
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should update localStorage when value changes", () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify("new-value")
    );
    expect(result.current[0]).toBe("new-value");
  });

  it("should work with function updates", () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify("old-value"));

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]((prev: string) => prev + "-updated");
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify("old-value-updated")
    );
  });

  it("should work with complex objects", () => {
    const complexObject = { name: "test", count: 42, nested: { value: true } };
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() =>
      useLocalStorage("test-key", complexObject)
    );

    expect(result.current[0]).toEqual(complexObject);

    const newObject = { ...complexObject, count: 43 };
    act(() => {
      result.current[1](newObject);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "test-key",
      JSON.stringify(newObject)
    );
  });

  it("should handle localStorage setItem errors", () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error("Storage quota exceeded");
    });
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("new-value");
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
