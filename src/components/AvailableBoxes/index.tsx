/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { _pushToastMessage } from "../../helpers/messages";
import BoxService from "../../services/box.service";
import Card from "../Card";
import loaderGif from "../../assets/gifs/loader-transparent.gif";

const AvailableBoxes = () => {
  const [boxes, setBoxes] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useSelector((state: any) => ({ session: state.session }));
  const Box = new BoxService();

  useEffect(() => {
    _getAvailableBoxes();
  }, []);

  const _getAvailableBoxes = async () => {
    try {
      setLoading(true);
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
          name: target?.box_type?.name,
          quantity: grouped[key]?.length,
          width: target?.box_type?.width,
          height: target?.box_type?.height,
          depht: target?.box_type?.depht,
        };
        return box;
      });

      setBoxes(boxes);
      setLoading(false);
    } catch (e: any) {
      _pushToastMessage({
        type: "warning",
        text: "No fue posible cargar las cajas disponibles",
        header: "Aviso",
      });
    }
  };

  return (
    <div className="row box py-4 px-2">
      <div className="col-12 size-09 bold mb-2 res-context-text">Cajas disponibles</div>

      {!loading && boxes.length === 0 && (
        <div className="col-12 d-flex justify-content-center align-items-center">
          <div className="res-state-message">No hay cajas disponibles</div>
        </div>
      )}
      {loading ? (
        <div className="col-12 d-flex justify-content-center align-items-center">
          <div className="res-state-message d-flex justify-content-center align-items-center gap-3">
            <img className="me-1" src={loaderGif} alt="loader" style={{ width: "38px" }} />
            Cargando cajas disponibles...
          </div>
        </div>
      ) : (
        <div className="col-12 d-flex justify-content-center flex-wrap">
          {boxes && boxes.map((box: any) => <Card {...box} key={box.name} />)}
        </div>
      )}
    </div>
  );
};

export default AvailableBoxes;
