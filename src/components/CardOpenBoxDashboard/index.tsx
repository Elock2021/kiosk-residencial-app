import Image from "../Image";
import boxImage from "../../assets/svg/box.svg";
import { Badge } from "rsuite";
import { formatChilleanPhone } from "../../helpers/functions";
import { useEffect, useState } from "react";

const CardOpenBoxDashboard = (props: any) => {
  const { door_number, status, data, _handleOpenBox } = props;
  const [reservation, setReservation] = useState<any>(null);

  useEffect(() => {
    if (data?.valid_reservations?.length > 0) {
      const reservations_ordered_by_id = data?.valid_reservations.sort(
        (a: any, b: any) => b.id - a.id
      );
      setReservation(reservations_ordered_by_id[0]);
    }
  }, [data]);

  const styles = {
    card: {
      backgroundColor: "#FFF",
      borderRadius: "7px",
      maxWidth: "270px",
      minWidth: "250px",
    },
    imageWrapper: {
      backgroundColor: "rgb(255 255 160)",
      borderRadius: "50%",
      width: "45px",
      height: "45px",
    },
  };

  return (
    <div
      className="p-2 col mx-2 my-3 shadow d-flex flex-column justify-content-around"
      style={styles.card}
    >
      <div className="d-flex justify-content-between align-items-center px-2 mt-2">
        <div>
          <div className="size-11 bold d-flex align-items-center">
            Caja {door_number}
            <Badge
              content={status}
              color={status === "Libre" ? "green" : "red"}
              className="ms-3"
              style={{ padding: "2px 15px", fontWeight: "bolder" }}
            />
          </div>
        </div>
        <div
          className="d-flex justify-content-center align-items-center"
          style={styles.imageWrapper}
        >
          <Image src={boxImage} style={{ width: "30px" }} />
        </div>
      </div>

      <div className="row my-1">
        <div className="col-12">
          {reservation && (
            <div className="size-08 px-3 bold">
              <div>{reservation?.delivery_user?.name}</div>
              <div>{formatChilleanPhone(reservation?.delivery_user?.phone)}</div>
            </div>
          )}
        </div>
      </div>

      <div className="row mt-3 mb-3">
        <div className="col-12 d-flex justify-content-around">
          <button
            className="px-5 py-2 main-button-dashboard bold shadow border rounded"
            onClick={() => _handleOpenBox(data)}
          >
            ABRIR
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardOpenBoxDashboard;
