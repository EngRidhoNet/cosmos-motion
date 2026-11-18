import path from "path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("angle");

Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...(currentConfiguration.resolve?.alias ?? {}),
        "@cosmos-motion/core": path.resolve(process.cwd(), "packages/core/index.ts"),
        "@cosmos-motion/characters": path.resolve(process.cwd(), "packages/characters/index.ts"),
        "@cosmos-motion/geo-space": path.resolve(process.cwd(), "packages/geo-space/index.ts"),
        "@cosmos-motion/scenes": path.resolve(process.cwd(), "packages/scenes/index.ts"),
      },
    },
  };
});
