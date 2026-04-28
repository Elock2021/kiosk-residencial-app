import { useEffect, useState } from "react";
import Circle from "../../../../assets/svg/circle.svg?react";
import Box from "../../../../assets/svg/yellow_box.svg?react";

const BoxComponent = ({ _handleOnclickBox, box }: any) => {
  const BigBox = () => {

    const [size, setSize] = useState('30px');

    useEffect(() => {

      setSize('70px');

      if(box.box_type_id === 1) {
        setSize('40px');
      }
      if(box.box_type_id === 2) {
        setSize('50px');
      }
      if(box.box_type_id === 3) {
        setSize('70px');
      }
    }, []);
    return (
      <div
        className="my-2 d-flex align-items-center justify-content-start px-4 text-black res-custody-box-card"
        onClick={() => _handleOnclickBox(box)}
      >
        <div
          className="d-flex justify-content-center align-items-center position-relative res-custody-box-card__icon-wrap"
        >
          <Circle style={{position: 'absolute', width: '100px', height: '100px'}}/>
          <Box style={{position: 'absolute', width: size, height: size}}/>
        </div>
        <div className="ms-4 text-white res-custody-box-card__content">
          <div className="bold">Abrir caja {box.name?.toLowerCase()}</div>
          <div className="d-flex flex-column size-08">
            <div className="me-3">Altura: {box.height / 10} cm</div>
            <div>Ancho: {box.width / 10} cm</div>
          </div>
        </div>
      </div>
    );
  };

  return <BigBox />;
};

export default BoxComponent;
