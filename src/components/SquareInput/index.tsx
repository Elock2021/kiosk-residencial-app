const SquareInput = (props: any) => {
  const { onChange, value, selected } = props;

  return (
    <div className="square">
      <input
        className={`${selected ? "selected" : ""} m-3 square-input shadow`}
        onChange={onChange}
        defaultValue={value}
        disabled
      />
      <div className="square-block" />
    </div>
  );
};

export default SquareInput;
