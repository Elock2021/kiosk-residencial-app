import HomeV0 from "./HomeV0";
import HomeV1 from "./HomeV1";
import HomeV2 from "./HomeV2";
import HomeV3 from "./HomeV3";
import HomeV4 from "./HomeV4";
import HomeV5 from "./HomeV5";
import { getHomeVariant } from "../../theme/homeVariant";

const Home = () => {
  const homeVariant = getHomeVariant();

  if (homeVariant === "v0") return <HomeV0 />;
  if (homeVariant === "v2") return <HomeV2 />;
  if (homeVariant === "v3") return <HomeV3 />;
  if (homeVariant === "v4") return <HomeV4 />;
  if (homeVariant === "v5") return <HomeV5 />;
  return <HomeV1 />;
};

export default Home;
