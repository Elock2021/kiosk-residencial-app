export type ResidentialTheme = "dark" | "light";
export type ResidentialVariant = "a" | "b";

const THEME_KEY = "residential-theme";
const VARIANT_KEY = "residential-ui-variant";

const ENV_DEFAULT_THEME = process.env.REACT_APP_RESIDENTIAL_DEFAULT_THEME;
const ENV_FORCED_THEME = process.env.REACT_APP_RESIDENTIAL_FORCE_THEME;

const isTheme = (value: unknown): value is ResidentialTheme =>
  value === "dark" || value === "light";

const isVariant = (value: unknown): value is ResidentialVariant =>
  value === "a" || value === "b";

const IS_DEV = process.env.NODE_ENV !== "production";
const HAS_FORCED_THEME = isTheme(ENV_FORCED_THEME);
const SHOULD_ENFORCE_FORCED_THEME = HAS_FORCED_THEME && !IS_DEV;

export const getInitialTheme = (): ResidentialTheme => {
  if (SHOULD_ENFORCE_FORCED_THEME && HAS_FORCED_THEME) {
    return ENV_FORCED_THEME;
  }

  const saved = localStorage.getItem(THEME_KEY);
  if (isTheme(saved)) {
    return saved;
  }

  return isTheme(ENV_DEFAULT_THEME) ? ENV_DEFAULT_THEME : "dark";
};

export const applyTheme = (theme: ResidentialTheme) => {
  document.documentElement.setAttribute("data-theme", theme);
};

export const setTheme = (theme: ResidentialTheme) => {
  // Respect forced theme outside development only.
  if (SHOULD_ENFORCE_FORCED_THEME && HAS_FORCED_THEME) {
    applyTheme(ENV_FORCED_THEME);
    return;
  }

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
