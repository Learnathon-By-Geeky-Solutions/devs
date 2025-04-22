import { useEffect, useState } from 'react';

export function useCookies<T>(
  key: string,
  initialValue: T,
  options: {
    expires?: Date;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {}
): [T | null, (value: T) => void] {
  // Get stored value from cookies or use initialValue
  const readValue = (): T | null => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const cookies = document.cookie.split(';');
      const cookieValue = cookies
        .find((cookie) => cookie.trim().startsWith(`${key}=`))
        ?.split('=')[1];

      return cookieValue
        ? JSON.parse(decodeURIComponent(cookieValue))
        : initialValue;
    } catch (error) {
      console.warn(`Error reading cookie key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T | null>(readValue);

  // Update cookies when the state changes
  const setValue = (value: T) => {
    try {
      // Save state
      setStoredValue(value);

      // Save to cookies
      if (typeof window !== 'undefined') {
        const {
          expires,
          path = '/',
          secure = false,
          sameSite = 'strict',
        } = options;

        let cookieString = `${key}=${encodeURIComponent(JSON.stringify(value))}`;

        if (expires) {
          cookieString += `; expires=${expires.toUTCString()}`;
        }

        cookieString += `; path=${path}`;

        if (secure) {
          cookieString += '; secure';
        }

        cookieString += `; samesite=${sameSite}`;

        document.cookie = cookieString;
      }
    } catch (error) {
      console.warn(`Error setting cookie key "${key}":`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [storedValue, setValue];
}
