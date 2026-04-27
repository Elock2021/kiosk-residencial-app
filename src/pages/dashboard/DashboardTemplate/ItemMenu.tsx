import { useNavigate } from "react-router-dom";

const ItemMenu = (props: any) => {
  const { selected, label, url, Icon, onClick } = props;
  const navigate = useNavigate();

  return (
    <div
      className="w-100 py-3 mb-2 text-center bold d-flex flex-column align-items-center size-08"
      style={{
        borderRight: selected ? "5px solid #0060E8" : "none",
        color: selected ? "#0060E8" : "#87898A",
        marginTop: "3px",
      }}
      onClick={onClick ? () => onClick() : () => navigate(url)}
    >
      {Icon ? (
        <>
          <Icon style={{ width: "40px", height: "40px" }} />
          {label}{" "}
        </>
      ) : (
        label
      )}
    </div>
  );
};

export default ItemMenu;
