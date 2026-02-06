import { useState, useEffect } from 'react';

/**
 * Hook for persisting state to localStorage
 * @param key - localStorage key
 * @param defaultValue - default value if no stored value exists
 * @returns [value, setValue] tuple like useState
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  // Initialize state from localStorage or default
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored) as T;
      }
    } catch (error) {
      // Silently fail on JSON parse errors
    }
    return defaultValue;
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      // Silently fail on storage errors (quota exceeded, etc.)
    }
  }, [key, state]);

  return [state, setState];
}
