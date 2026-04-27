import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), "");
  const mergedEnv = { ...loadedEnv, ...process.env };
  const processEnv = Object.fromEntries(
    Object.entries(mergedEnv).filter(([key]) => key.startsWith("REACT_APP_"))
  );

  processEnv.NODE_ENV = mode;

  return {
    base: "/kiosk-residencial-app/",
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    define: {
      "process.env": JSON.stringify(processEnv),
    },
    build: {
      outDir: "build",
      emptyOutDir: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ["legacy-js-api"],
        },
      },
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 4173,
    },
  };
});
