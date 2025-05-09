import { useState } from "react";

export const useAppTheme = () => {
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  const theme: "light" | "dark" = isDark ? "dark" : "light";

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return { theme, toggleTheme } as const;
};
