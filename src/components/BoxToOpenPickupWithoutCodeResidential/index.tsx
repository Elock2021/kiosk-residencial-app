/* eslint-disable react-hooks/exhaustive-deps */

import { useSelector } from "react-redux";
import CardOpenBoxResidential from "../CardOpenBoxResidential";

const BoxToOpenPickupWithoutCodeResidential = (props: any) => {
  const { action, text = "retira" } = props;
  const { pickup, session } = useSelector((state: any) => ({ pickup: state.pickup, session: state.session }));
  const { boxes } = pickup;
  const assets = session.profile?.assets?.assets;

  return (
    <div className="d-flex justify-content-center align-items-center mt-2">
      <div
        className=" d-flex align-items-center justify-content-around flex-column p-5"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          width: "90%",
          borderRadius: "30px",
          height: "500px",
        }}
      >
        <div
          className="w-100 size-12 bold my-2 px-4 text-center"
          style={{ color: "#FFF" }}
        >
          {assets?.pickup_without_code_step_five_text_one || `Abre la(s) caja(s) y ${text} tu paquete`}
        </div>
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
  );
};

export default BoxToOpenPickupWithoutCodeResidential;
