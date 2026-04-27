import { useNavigate } from "react-router-dom";
import { navigationRef } from "../helpers/navigationHelper";

const NavigationContext = ({ children }: any) => {
  const navigate = useNavigate();
  navigationRef.navigate = navigate;
  return <>{children}</>;
};

export default NavigationContext;
