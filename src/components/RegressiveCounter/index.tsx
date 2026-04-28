/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface IRegressiveCounterProps {
    handleCallback: () => void;
    display?: boolean;
    clearIntervalAction: number;
    paused?: boolean;
}

const RegressiveCounter = ({ handleCallback, display = true, paused = false, clearIntervalAction }: IRegressiveCounterProps) => {
    const [count, setCount] = useState(10);
    const { timer } = useSelector((state: any) => ({ timer: state.timer }));
    let interval: any = useRef(null);

    useEffect(() => {

        if(paused) return;

        setCount(timer.seconds);

        if (interval.current) clearInterval(interval);

        interval.current = setInterval(() => {
            setCount((prev) => {
                if (prev === 0) {
                    handleCallback();
                    clearInterval(interval.current);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval.current);
    }, [timer, paused]);

    useEffect(() => {
        if (clearIntervalAction > 0 && interval.current) {
            console.log("CLEAR INTERVAL");  
            clearInterval(interval.current);
        }
    }, [clearIntervalAction]);

    if(paused) return null;

    const urgencyClass =
      count <= 2 ? "res-regressive-counter--danger" : count <= 5 ? "res-regressive-counter--warning" : "res-regressive-counter--normal";

    return <div className={`bold res-regressive-counter ${urgencyClass}`}>{count}</div>;
};

export default RegressiveCounter;
