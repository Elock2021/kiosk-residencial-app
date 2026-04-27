/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import { useEffect, useState } from "react";

const Clock = () => {
  const [state, setState] = useState({ time: moment().format("HH:mm") });
  const [update, setUpdate] = useState<any>(null);

  useEffect(() => {
    setUpdate(
      setInterval(() => {
        setState({ ...state, time: moment().format("HH:mm") });
      }, 1000)
    );

    return () => {
      if (update !== null) {
        setUpdate(null);
      }
    };
  }, []);
  return <div className="bold">{state.time}</div>;
};

export default Clock;
