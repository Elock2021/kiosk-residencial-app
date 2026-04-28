/* eslint-disable react-hooks/exhaustive-deps */

import { useSelector } from "react-redux";
import CardOpenBoxResidential from "../CardOpenBoxResidential";

const BoxToOpenPickupResidential = (props: any) => {
  const { action, text = "retira" } = props;
  const { pickup } = useSelector((state: any) => ({ pickup: state.pickup }));
  const { boxes } = pickup;

  return (
    <div className="d-flex justify-content-center align-items-center w-100" style={{ marginTop: "-70px" }}>
      <div className="d-flex align-items-center justify-content-around flex-column w-100">
        <div className="w-100 size-12 bold mt-0 px-4 text-center color-white" style={{ marginTop: "44px", marginBottom: "72px" }}>
          Presiona abrir para retirar tus paquetes del locker
        </div>
        <div
          className="d-flex flex-wrap justify-content-center align-items-center"
          style={{ minHeight: "420px", alignContent: "center" }}
        >
          {boxes &&
            boxes?.map((box: any) => (
              <CardOpenBoxResidential
                {...box}
                key={box.id}
                data={box}
                action={action}
                boxQuantity={boxes?.length}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BoxToOpenPickupResidential;
