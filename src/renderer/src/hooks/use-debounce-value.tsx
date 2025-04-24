import { useEffect, useState } from "react";

export const useDebounceValue = <T,>(value: T, time: number = 250) => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(value);
    }, time);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, time]);

  return debounced;
};
