import { useNavigate } from "react-router-dom";
import ApartmentKeyboardWithRedirect from "../ApartamentKeyboardWithRedirect";
import Header from "../../components/Header";

const ApartmentKeyboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid h-100 res-page">
      <Header />
      <div className="res-content d-flex justify-content-center align-items-center p-0">
        <ApartmentKeyboardWithRedirect
          embedded
          title="Ingrese el número de su domicilio"
          hint=""
          placeholder="Ej: 203, 12A"
          backLabel="Volver"
          backButtonClassName="res-help-back-button"
          onContinue={async (apartment: string) => {
            navigate(`/delivery-with-apartament/${apartment}`, { replace: true });
          }}
          onBack={() => navigate("/")}
        />
      </div>
    </div>
  );
};

export default ApartmentKeyboard;
