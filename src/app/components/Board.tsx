import React from "react";
//* TYPES DEFINITION .
interface Props {
  board: { [k: string]: number[] };
  canPlay: boolean;
}
//* PAWS DEFINITION .
const WhitePawn = () => <div className="wP"></div>;
const BlackPawn = () => <div className="bP"></div>;
//* JSX .
const Board = ({ board, canPlay }: Props) => {
  return (
    <div className="boardContainer">
      <div className="board">
        {Object.keys(board).map((el) =>
          board[el].map((cell, index) => (
            <div key={index} className="cell" id={index.toString()}>
              {cell ? cell === 1 ? <WhitePawn /> : <BlackPawn /> : null}
            </div>
          ))
        )}
      </div>
      {!canPlay && <div id="blocker"></div>}
    </div>
  );
};

export default Board;
