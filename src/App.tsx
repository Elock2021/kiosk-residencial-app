import { Provider } from "react-redux";
import store from "./redux/store";
import RouterWrapper from "./routers/RouterWrapper";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import {
  applyTheme,
  applyVariant,
  getInitialTheme,
  getInitialVariant,
} from "./modules/Residential/theme";
import "react-toastify/dist/ReactToastify.css";
import "./styles/_global.scss";

const App = () => {
  useEffect(() => {
    applyTheme(getInitialTheme());
    applyVariant(getInitialVariant());
  }, []);

  return (
    <Provider store={store}>
      <ToastContainer />
      <RouterWrapper />
    </Provider>
  );
};

export default App;
