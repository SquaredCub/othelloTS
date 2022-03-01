import React from "react";
import { State } from "../logic/state";
import { isMoveLegal } from "../logic/checks";
//. TYPES DEFINITION .
interface Props {
  board: number[][];
  canPlay: boolean;
  state: State;
  dispatch: React.Dispatch<any>;
}
//. PAWS DEFINITION .
const WhitePawn = () => <div className="wP"></div>;
const BlackPawn = () => <div className="bP"></div>;
//. JSX .
const Board = ({ board, state, dispatch }: Props) => {
  const handleCellClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    //* Defining arguments for checks .
    const position = target.id.split(",").map((el) => parseInt(el));
    const color = state.whosTurn;
    const currentBoard = state.board;
    console.log("User clicked " + position);
    //* LOGGING RESULTS OF CHECKS .
    /* console.log(`Position: [${target.id}]`);
    console.log(`Color playing: ${state.whosTurn}`); */
    //console.log(isMoveLegal({ position, color, currentBoard }));
    //* Taking action :
    const move = isMoveLegal({ position, color, currentBoard });
    if (move.status) {
      console.log("%cLegal move, proceeding", "color: green");
      dispatch({ type: "move", payload: { position, color } });
      console.log(move.pawnsTurned);
      //dispatch({ type: "switchPlayer" });
    } else {
      //console.log(isMoveLegal({ position, color, currentBoard }), "color: red");
    }
  };
  return (
    <div className="boardContainer">
      <div className="board">
        {board.map((line, lineIndex) =>
          line.map((cell, cellIndex) => (
            <div
              key={`${lineIndex},${cellIndex}`}
              className="cell"
              id={`${lineIndex},${cellIndex}`}
              onClick={handleCellClick}
            >
              {cell ? cell === 1 ? <WhitePawn /> : <BlackPawn /> : null}
              <span className="tooltip">{`${lineIndex},${cellIndex}`}</span>
            </div>
          ))
        )}
      </div>
      {(!state.isPlaying || state.isGameOver) && <div id="blocker"></div>}
    </div>
  );
};

export default Board;
