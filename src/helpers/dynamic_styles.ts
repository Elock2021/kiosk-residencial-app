export const handleDynamicStyles = (assets: any, prefix: string) => {
  const root = document.querySelector<HTMLElement>(":root");
  if (root) {
    Object.keys(assets)
      .filter((key) => key.includes("color") && key.includes(prefix))
      .forEach((colorProp) => {
        root.style.setProperty(
          `--${colorProp.replace(/_/g, "-")}`,
          `rgba(${assets[colorProp]?.r}, ${assets[colorProp]?.g}, ${assets[colorProp]?.b}, ${assets[colorProp]?.a})`
        );
      });
  }
};

export const handleAllColorStyles = (assets: any) => {
  if (!assets) return;
  const root = document.querySelector<HTMLElement>(":root");
  if (root) {
    Object.keys(assets)
      .filter((key) => key.includes("color"))
      .forEach((colorProp) => {
        root.style.setProperty(
          `--${colorProp.replace(/_/g, "-")}`,
          `rgba(${assets[colorProp]?.r}, ${assets[colorProp]?.g}, ${assets[colorProp]?.b}, ${assets[colorProp]?.a})`
        );
      });
  }
};
