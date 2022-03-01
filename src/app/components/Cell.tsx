import React, { useEffect, useState } from "react";

interface Props {
  cellId: string;
  turn: boolean;
  setTurn: React.Dispatch<React.SetStateAction<boolean>>;
}
const WhitePawn = () => <div className="wP"></div>;
const BlackPawn = () => <div className="bP"></div>;

const Cell = ({ cellId, turn, setTurn }: Props) => {
  const [content, setContent] = useState(0);
  const contents = [null, <WhitePawn />, <BlackPawn />];
  const handleClick = (e: React.MouseEvent) => {
    if (content === 0) {
      if (turn) setContent(1);
      else setContent(2);
      setTurn((old) => !old);
    }
  };
  return (
    <div className="cell" id={cellId} onClick={handleClick}>
      {contents[content]}
    </div>
  );
};

export default Cell;
