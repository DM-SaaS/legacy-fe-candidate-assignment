import { useState, useCallback } from "react";
import { saveToStorage, loadFromStorage } from "../utils/helper";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    const stored = loadFromStorage<T>(key);
    return stored !== null ? stored : initialValue;
  });

  const setStoredValue = useCallback(
    (newValue: T) => {
      setValue(newValue);
      saveToStorage<T>(key, newValue);
    },
    [key]
  );

  return [value, setStoredValue] as const;
};
