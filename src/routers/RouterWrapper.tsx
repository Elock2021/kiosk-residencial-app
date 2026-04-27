/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Loader from "../components/Loader";
import ResidentialRouter from "./ResidentialRouter";
import { SET_TIMER } from "../redux/actions/timer";
import ModuleVersion from "../components/ModuleVersion";
import AutoUpdate from "../components/AutoUpdate";

const RouterWrapper = () => {
  const dispatch: any = useDispatch();

  useEffect(() => {
    dispatch(SET_TIMER({ seconds: process.env.REACT_APP_TIMER_SECONDS || 15 }));
  }, []);

  return (
    <>
      <Loader />
      <AutoUpdate />
      <ModuleVersion module="residential-module" version="1.0.0" showVersion={false} />
      <ResidentialRouter />
    </>
  );
};

export default RouterWrapper;
