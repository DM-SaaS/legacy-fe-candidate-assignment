import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../../hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));

    expect(result.current).toBe("initial");
  });

  it("should debounce value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    expect(result.current).toBe("initial");

    // Change the value
    rerender({ value: "updated", delay: 500 });

    // Value should not be updated immediately
    expect(result.current).toBe("initial");

    // Fast-forward time by 499ms
    act(() => {
      vi.advanceTimersByTime(499);
    });

    // Value should still not be updated
    expect(result.current).toBe("initial");

    // Fast-forward time by 1ms more (total 500ms)
    act(() => {
      vi.advanceTimersByTime(1);
    });

    // Value should now be updated
    expect(result.current).toBe("updated");
  });

  it("should reset timer on rapid value changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    // First change
    rerender({ value: "first", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Second change before first completes
    rerender({ value: "second", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Should still be initial value
    expect(result.current).toBe("initial");

    // Complete the timer
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // Should be the latest value
    expect(result.current).toBe("second");
  });

  it("should handle delay changes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    rerender({ value: "updated", delay: 1000 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should not be updated yet due to longer delay
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Should now be updated
    expect(result.current).toBe("updated");
  });

  it("should handle zero delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 0 },
      }
    );

    rerender({ value: "updated", delay: 0 });

    // Should update immediately on next tick
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe("updated");
  });

  it("should work with different value types", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 100 },
      }
    );

    expect(result.current).toBe(0);

    rerender({ value: 42, delay: 100 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe(42);
  });

  it("should work with object values", () => {
    const initialObj = { name: "John", age: 30 };
    const updatedObj = { name: "Jane", age: 25 };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: initialObj, delay: 200 },
      }
    );

    expect(result.current).toBe(initialObj);

    rerender({ value: updatedObj, delay: 200 });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe(updatedObj);
  });
});
