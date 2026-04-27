export type ResidentialHomeVariant = "v0" | "v1" | "v2" | "v3" | "v4" | "v5";

const ENV_HOME_VARIANT = process.env.REACT_APP_RESIDENTIAL_HOME_VARIANT;

const isHomeVariant = (value: unknown): value is ResidentialHomeVariant =>
  value === "v0" ||
  value === "v1" ||
  value === "v2" ||
  value === "v3" ||
  value === "v4" ||
  value === "v5";

export const getHomeVariant = (): ResidentialHomeVariant => {
  const normalized = String(ENV_HOME_VARIANT || "")
    .trim()
    .toLowerCase();

  return isHomeVariant(normalized) ? normalized : "v1";
};
