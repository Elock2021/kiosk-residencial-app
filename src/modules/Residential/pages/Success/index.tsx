import Image from "../../../../components/Image";
import Header from "../../components/Header";
import checked from "../../../../assets/svg/checked.svg";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid h-100 res-page">
      <Header />
      <div className="res-content d-flex align-items-center justify-content-center">
        <div className="res-shell d-flex flex-column justify-content-center align-items-center gap-4">
          <Image src={checked} alt="Transacción completada" className="res-success-icon" />

          <div className="bold text-center res-title">
            Transacción completada
            <br />
            con éxito
          </div>

          <div className="res-footer-actions res-footer-actions--center">
            <button className="main-button" onClick={() => navigate("/")}>
              Volver al home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
