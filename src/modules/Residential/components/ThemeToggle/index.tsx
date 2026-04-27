import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { getInitialTheme, setTheme } from "../../theme";

const ThemeToggle = () => {
  const [theme, setThemeState] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    setTheme(initial);
  }, []);

  const handleToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setThemeState(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className="res-theme-toggle"
      onClick={handleToggle}
      aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
      title={`Modo ${theme === "dark" ? "oscuro" : "claro"}`}
    >
      {theme === "dark" ? <FiMoon aria-hidden="true" /> : <FiSun aria-hidden="true" />}
    </button>
  );
};

export default ThemeToggle;
