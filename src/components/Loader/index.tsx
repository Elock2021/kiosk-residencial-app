import { useSelector } from "react-redux";

const Loader = () => {
  const { loader } = useSelector((state: any) => ({ loader: state.loader }));

  return (
    <div
      className="res-loader-overlay"
      style={{ display: loader.is_loading ? "flex" : "none" }}
    >
      <div className="loader-container" aria-live="polite" aria-label="Cargando">
        <div className="res-loader-bubble">
          <div className="loader-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
