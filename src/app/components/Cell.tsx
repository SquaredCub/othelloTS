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
  useEffect(() => {
    switch (cellId) {
      case "27":
        setContent(1);
        break;
      case "28":
        setContent(2);
        break;
      case "35":
        setContent(2);
        break;
      case "36":
        setContent(1);
        break;
      default:
        setContent(0);
    }
  }, [cellId]);
  const handleClick = (e: React.MouseEvent) => {
    console.log(e.target);
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
