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
    console.log("User clicked");
    const target = e.target as HTMLElement;
    //* Defining arguments for checks .
    const position = target.id.split(",").map((el) => parseInt(el));
    const color = state.whosTurn;
    const currentBoard = state.board;
    //* LOGGING RESULTS OF CHECKS .
    /* console.log(`Position: [${target.id}]`);
    console.log(`Color playing: ${state.whosTurn}`); */
    //console.log(isMoveLegal({ position, color, currentBoard }));
    //* Taking action :
    if (typeof isMoveLegal({ position, color, currentBoard }) === "boolean") {
      dispatch({ type: "move", payload: { position, color } });
      //dispatch({ type: "switchPlayer" });
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
            </div>
          ))
        )}
      </div>
      {(!state.isPlaying || state.isGameOver) && <div id="blocker"></div>}
    </div>
  );
};

export default Board;
