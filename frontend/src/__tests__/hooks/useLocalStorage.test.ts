import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("should return initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));

    expect(result.current[0]).toBe("initial");
  });

  it("should return stored value when localStorage has data", () => {
    localStorage.setItem("testKey", JSON.stringify("stored"));

    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));

    expect(result.current[0]).toBe("stored");
  });

  it("should handle JSON parse errors gracefully", () => {
    localStorage.setItem("testKey", "invalid json");

    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));

    expect(result.current[0]).toBe("initial");
  });

  it("should update localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));

    act(() => {
      result.current[1]("updated");
    });

    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorage.getItem("testKey")!)).toBe("updated");
  });

  it("should work with function updates", () => {
    const { result } = renderHook(() => useLocalStorage("testKey", 0));

    act(() => {
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("should work with complex objects", () => {
    const initialObj = { name: "John", age: 30 };
    const { result } = renderHook(() => useLocalStorage("testKey", initialObj));

    const updatedObj = { name: "Jane", age: 25 };

    act(() => {
      result.current[1](updatedObj);
    });

    expect(result.current[0]).toEqual(updatedObj);
  });

  it("should handle localStorage setItem errors", () => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error("localStorage is full");
    };

    const { result } = renderHook(() => useLocalStorage("testKey", "initial"));

    // Should not throw an error
    expect(() => {
      act(() => {
        result.current[1]("new value");
      });
    }).not.toThrow();

    // Restore original setItem
    Storage.prototype.setItem = originalSetItem;
  });
});
