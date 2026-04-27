import { useSelector } from "react-redux";
import loaderGif from "../../assets/gifs/loader-transparent.gif";

const Loader = () => {
  const { loader } = useSelector((state: any) => ({ loader: state.loader }));

  return (
    <div
      className="res-loader-overlay"
      style={{
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "var(--res-overlay, rgba(0, 0, 0, 0.5))",
        zIndex: 1051,
        display: loader.is_loading ? "flex" : "none",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className="res-loader-bubble"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "92px",
          height: "92px",
          borderRadius: "50%",
          border: "1px solid var(--res-border-strong, rgba(255,255,255,0.24))",
          background: "var(--res-surface-elevated, rgba(20,28,39,0.92))",
        }}
      >
        <img src={loaderGif} alt="Cargando" style={{ width: "52px" }} />
      </div>
    </div>
  );
};

export default Loader;
