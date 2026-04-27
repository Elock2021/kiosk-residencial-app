/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

const ModuleVersion = ({
  module,
  version,
  showVersion,
}: {
  module: string;
  version: string;
  showVersion?: boolean;
}) => {
  useEffect(() => {
    const body = document.querySelector("body");
    const div = document.createElement("div");
    div.className = "root-version";
    div.innerHTML = `${module} - ${version}`;
    if (showVersion) {
      body?.appendChild(div);
    }
  }, []);

  return null;
};

export default ModuleVersion;
