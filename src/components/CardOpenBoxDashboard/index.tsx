import Image from "../Image";
import boxImage from "../../assets/png/casillero_chico.png";
import { formatChilleanPhone } from "../../helpers/functions";
import { useEffect, useState } from "react";

const CardOpenBoxDashboard = (props: any) => {
  const { door_number, status, data, onSelectBox } = props;
  const [reservation, setReservation] = useState<any>(null);
  const isFree = status === "Libre";

  useEffect(() => {
    if (data?.valid_reservations?.length > 0) {
      const reservations_ordered_by_id = [...data.valid_reservations].sort(
        (a: any, b: any) => b.id - a.id
      );
      setReservation(reservations_ordered_by_id[0]);
      return;
    }

    setReservation(null);
  }, [data]);

  return (
    <div
      className={`p-3 my-2 d-flex flex-column justify-content-around db-box-card ${
        isFree ? "db-box-card--free" : "db-box-card--busy"
      }`}
      onClick={() => onSelectBox(data)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          onSelectBox(data);
        }
      }}
    >
      <div className="d-flex justify-content-between align-items-center px-2 mt-2">
        <div>
          <div className="size-11 bold d-flex align-items-center">
            Puerta {door_number}
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center db-box-card__icon-wrap">
          <Image src={boxImage} style={{ width: "34px" }} />
        </div>
      </div>

      <div className="row my-1">
        <div className="col-12">
          {reservation && (
            <div className="size-08 px-3 bold db-box-card__person">
              <div>{reservation?.delivery_user?.name}</div>
              <div className="db-box-card__phone">{formatChilleanPhone(reservation?.delivery_user?.phone)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="row mt-3 mb-3">
        <div className="col-12 d-flex justify-content-around">
          <div className="db-box-card__action">
            VER ACCIONES
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardOpenBoxDashboard;
