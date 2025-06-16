export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const loadFromStorage = <T>(key: string): T | null => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : null;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
};
