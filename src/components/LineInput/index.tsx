const LineInput = (props: any) => {
  const { onChange, value, selected } = props;

  return (
    <div className="square">
      <input
        className={`${selected ? "selected" : ""} m-2 bold size-15`}
        style={{
          width: "60px",
          height: "50px",
          textAlign: "center",
          background: "transparent",
          borderBottom: "2px solid white",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          color: "white",
        }}
        onChange={onChange}
        defaultValue={value}
        disabled
      />
      <div className="square-block" />
    </div>
  );
};

export default LineInput;
