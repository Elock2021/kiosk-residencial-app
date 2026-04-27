/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { _pushToastMessage } from "../../helpers/messages";
import { set_loader } from "../../redux/actions/loader";
import BoxService from "../../services/box.service";
import CardWithSelect from "../CardWithSelect";

const AvailableBoxesWithSelect = ({ onUpdateBox, update, boxStyle = {} }: any) => {
  const [boxes, setBoxes] = useState<any>([]);
  const { session, order } = useSelector((state: any) => ({ session: state.session, order: state.order }));
  const Box = new BoxService();
  const dispatch: any = useDispatch();
  const assets = session?.profile?.assets?.assets;

  useEffect(() => {
    _getAvailableBoxes();
  }, [update]);

  const _getAvailableBoxes = async () => {
    try {
      dispatch(set_loader({ is_loading: true }));
      const response: any = await Box.available_boxes(session?.profile?.id);
      const { data } = response;

      const grouped: any = data.reduce((acc: any, current: any) => {
        if (acc[current.box_type_id]) {
          acc[current.box_type_id].push(current);
        } else {
          acc[current.box_type_id] = [current];
        }
        return acc;
      }, {});

      const boxes: any = Object.keys(grouped).map((key: any) => {
        const target: any = grouped[key][0];

        const box: any = {
          id: key,
          name: target?.box_type?.name,
          quantity: grouped[key]?.length,
          width: target?.box_type?.width,
          height: target?.box_type?.height,
          depht: target?.box_type?.depht,
          box_type_id: target?.box_type?.id,
          quantity_selected: 0,
        };
        return box;
      });

      setBoxes(boxes);

      dispatch(set_loader({ is_loading: false }));
    } catch (e: any) {
      _pushToastMessage({
        type: "warning",
        text: "No fue posible cargar las cajas disponibles",
        header: "Aviso",
      });
      dispatch(set_loader({ is_loading: false }));
    }
  };

  const _handlePlusQuantitySelected = (id: any) => {
    if (order?.user?.reservation?.reservation_type === "pickup_box_created") {
      const selected: any = boxes.filter(
        (item: any) => item.quantity_selected > 0
      );
      if (selected.length > 0) {
        _pushToastMessage({
          type: "warning",
          header: "Aviso",
          text: "Esta reserva solo acepta una caja.",
        });
        return;
      }
    }
    const box = boxes.find((b: any) => b.id === id);
    if (box.quantity > box.quantity_selected) {
      box.quantity_selected++;
    }
    setBoxes([...boxes]);
    onUpdateBox(boxes);
  };

  const _handleSubtractQuantitySelected = (id: any) => {
    const box = boxes.find((b: any) => b.id === id);
    if (box.quantity_selected > 0) {
      box.quantity_selected--;
    }
    setBoxes([...boxes]);
    onUpdateBox(boxes);
  };

  return (
    <div className="row box py-4 justify-content-around">
      <div className="col-12 size-14 bold my-2 px-4 text-center color-white">
        {assets?.pickup_without_reservation_load_step_three_text_one ||
          "Selecciona cuantas cajas necesitas"}
      </div>
      {boxes &&
        boxes.map((box: any) => (
          <CardWithSelect
            {...box}
            key={box.name}
            onPlus={_handlePlusQuantitySelected}
            onSubtract={_handleSubtractQuantitySelected}
            boxStyle={{ ...boxStyle }}
          />
        ))}
    </div>
  );
};

export default AvailableBoxesWithSelect;
