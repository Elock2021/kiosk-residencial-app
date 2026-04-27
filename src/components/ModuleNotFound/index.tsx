/* eslint-disable react-hooks/exhaustive-deps */

const ModuleNotFound = () => {
  return (
    <div className="container-fluid h-100">
      <div className="content-section">
        <div
          className="row align-items-center justify-content-center mt-5 bold"
          style={{ height: "550px", fontSize: "40px" }}
        >
          <div className="col-12 text-center">
            El modulo informado no fue encontrado. Verifique se la aplicacion
            tiene la ultima version disponible instalada.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleNotFound;
