/* eslint-disable react-hooks/exhaustive-deps */
import Circle from "../../assets/svg/circle.svg?react";
import User from "../../assets/svg/box.svg?react";
const CardAvailableBoxes = ({ label, description, _handleOpenBox }: any) => {
  const styles = {
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: "7px",
      maxWidth: "270px",
      minWidth: "250px",
      maxHeight: "240px",
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
      className={`p-2 d-flex flex-column justify-content-between mx-2 my-3 shadow border border-3 border-dark`}
      style={styles.card}
    >
      <div
        className="w-100 d-flex justify-content-center align-items-center position-relative"
        style={{ width: "100%", height: "60px" }}
      >
        <Circle
          className="position-absolute"
          style={{ width: "50px", height: "50px" }}
        />
        <User
          className="position-absolute"
          style={{ width: "30px", height: "30px" }}
        />
      </div>
      <div className="d-flex justify-content-center align-items-center flex-column text-center px-2 mt-2">
        <div>
          <div className="w-100 size-11 bold">{label}</div>
          <div className="w-100 size-07">{description}</div>
        </div>
      </div>

      <div className="row mt-3 px-5 mb-3">
        <button
          className="me-4 px-4 py-2 border-0 main-button-yellow bold shadow"
          onClick={_handleOpenBox}
        >
          Retirar
        </button>
      </div>
    </div>
  );
};

export default CardAvailableBoxes;
