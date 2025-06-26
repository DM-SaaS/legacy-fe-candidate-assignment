export const localStorageUtils = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItem: (key: string, value: any): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error);
    }
  },

  getItem: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting localStorage item "${key}":`, error);
      return defaultValue ?? null;
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage item "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
