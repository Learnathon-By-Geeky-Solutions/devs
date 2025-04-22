export class StorageService {
  setItem(key: string, value: unknown): void {
    if (typeof window === 'undefined') return;

    try {
      if (value === undefined) {
        localStorage.removeItem(key);
        return;
      }

      const serialized =
        typeof value === 'object' && value !== null
          ? JSON.stringify(value)
          : String(value);

      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error storing item ${key}:`, error);
    }
  }

  getItem<T>(key: string, defaultValue: T | null = null): T | null {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;

      if (value.startsWith('{') || value.startsWith('[')) {
        return JSON.parse(value) as T;
      }

      if (value === 'true') return true as unknown as T;
      if (value === 'false') return false as unknown as T;
      if (!isNaN(Number(value)) && value.trim() !== '') return Number(value) as unknown as T;

      return value as unknown as T;
    } catch (error) {
      console.error(`Error retrieving item ${key}:`, error);
      return defaultValue;
    }
  }

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }
}

export const storageService = new StorageService();
