export type ResidentialTheme = "dark" | "light";
export type ResidentialVariant = "a" | "b";

const THEME_KEY = "residential-theme";
const VARIANT_KEY = "residential-ui-variant";

const ENV_DEFAULT_THEME = process.env.REACT_APP_RESIDENTIAL_DEFAULT_THEME;

const isTheme = (value: unknown): value is ResidentialTheme =>
  value === "dark" || value === "light";

const isVariant = (value: unknown): value is ResidentialVariant =>
  value === "a" || value === "b";

export const getInitialTheme = (): ResidentialTheme => {
  const saved = localStorage.getItem(THEME_KEY);
  if (isTheme(saved)) {
    return saved;
  }

  return isTheme(ENV_DEFAULT_THEME) ? ENV_DEFAULT_THEME : "light";
};

export const applyTheme = (theme: ResidentialTheme) => {
  document.documentElement.setAttribute("data-theme", theme);
};

export const setTheme = (theme: ResidentialTheme) => {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
};

export const getInitialVariant = (): ResidentialVariant => {
  const saved = localStorage.getItem(VARIANT_KEY);
  return isVariant(saved) ? saved : "a";
};

export const applyVariant = (variant: ResidentialVariant) => {
  document.documentElement.setAttribute("data-ui-variant", variant);
};

export const setVariant = (variant: ResidentialVariant) => {
  localStorage.setItem(VARIANT_KEY, variant);
  applyVariant(variant);
};
