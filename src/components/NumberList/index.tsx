const NumberList = ({
  number,
  title,
  text,
  color = "#AB1D2D",
}: {
  number: number;
  title: string;
  text: string;
  color?: string;
}) => {
  return (
    <div className="d-flex mb-3">
      <div
        className="d-flex justify-content-center align-items-center me-3 bold"
        style={{
          borderRadius: "50%",
          width: "30px",
          minWidth: "30px",
          minHeight: "30px",
          height: "30px",
          border: `2px solid ${color}`,
        }}
      >
        {number}
      </div>
      <div className="d-flex flex-column justify-content-center">
        <div className="bold" style={{ color: `${color}`, lineHeight: "17px" }}>
          {title}
        </div>
        <div style={{ fontSize: "15px", lineHeight: '18px' }}>{text}</div>
      </div>
    </div>
  );
};

export default NumberList;
