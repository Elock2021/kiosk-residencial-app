import elockLogo from "../../assets/logos/elock-logo.png";
import guxlogo from "../../assets/logos/elock-logo.png";
import liderLogo from "../../assets/logos/lider.svg";
import lascondesLogo from "../../assets/logos/lascondes.png";
import cuboLogo from "../../assets/logos/cubo.svg";
import cuboWithoutText from "../../assets/logos/cubo_without_text.png";
import unab from "../../assets/logos/unab.png";

const Logo = (props: any) => {
  const { company, style, url } = props;

  switch (company) {
    case "elock":
      return (
        <img
          src={elockLogo}
          style={style || {}}
          className={`${style ? "" : "w-100"}`}
          alt="logo"
        />
      );
    case "gux":
      return (
        <img
          src={guxlogo}
          style={style || {}}
          className={`${style ? "" : "w-100"}`}
          alt="logo"
        />
      );
    case "lider":
      return (
        <img
          src={liderLogo}
          style={style || {}}
          className={`${style ? "" : "w-100"}`}
          alt="logo"
        />
      );

    case "lascondes":
      return (
        <img
          src={lascondesLogo}
          style={style || {}}
          className={`${style ? "" : "w-100"}`}
          alt="logo"
        />
      );
    case "cubo":
      return (
        <img
          src={cuboLogo}
          style={style || {}}
          className={`${style ? "" : "w-100"}`}
          alt="logo"
        />
      );
    case "cubo_without_logo":
      return (
        <img
          src={cuboWithoutText}
          style={style || {}}
          className={`${style ? "" : "w-100"}`}
          alt="logo"
        />
      );
    case "unab":
      return (
        <img
          src={unab}
          style={style || {}}
          className={`${style ? "" : "w-100"}`}
          alt="logo"
        />
      );
    default:
      return (
        <img
          src={url || elockLogo}
          style={style || {}}
          className={`${style ? "" : "w-100"}`}
          alt="logo"
        />
      );
  }
};
export default Logo;
