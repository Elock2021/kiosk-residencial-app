/* eslint-disable react-hooks/exhaustive-deps */

import { useSelector } from "react-redux";
import CardOpenBoxResidential from "../CardOpenBoxResidential";

const BoxToOpenPickupResidential = (props: any) => {
  const { action, text = "retira" } = props;
  const { pickup, session } = useSelector((state: any) => ({ pickup: state.pickup, session: state.session }));
  const { boxes } = pickup;
  const assets = session.profile?.assets?.assets;

  return (
    <div className="d-flex justify-content-center align-items-center mt-2 w-100">
      <div className="d-flex align-items-center justify-content-around flex-column res-box-open-container">
        <div className="w-100 size-12 bold my-2 px-4 text-center color-white">
          {assets?.pickup_step_two_text_one || `Abre la(s) caja(s) y ${text} tu paquete`}
        </div>
        <div className="d-flex flex-wrap justify-content-center align-items-center">
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
