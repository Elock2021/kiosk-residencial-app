/* eslint-disable react-hooks/exhaustive-deps */

import { useSelector } from "react-redux";
import CardOpenBox from "../CardOpenBox";

const BoxToOpenDelivery = (props: any) => {
  const { module, action } = props;
  const { delivery, order, session } = useSelector((state: any) => ({ delivery: state.delivery, order: state.order, session: state.session }));
  const assets = session?.profile?.assets?.assets;
  const boxes: any = module === "residential" ? order.boxes : delivery.boxes;
  return (
    <div className="row box py-4 justify-content-around">
      <div
        className="col-12 size-14 bold my-2 px-4 text-center"
        style={{ color: "#3f3f3f", textTransform: "uppercase" }}
      >
        {assets?.pickup_load_step_two_text_one || assets?.pickup_without_reservation_pickup_step_two_text_one || "Abre la(s) caja(s) y guarda tu paquete"}
      </div>
      {boxes &&
        boxes.map((box: any) => (
          <CardOpenBox {...box} key={box.id} data={box} action={action} boxQuantity={boxes?.length}/>
        ))}
    </div>
  );
};

export default BoxToOpenDelivery;
