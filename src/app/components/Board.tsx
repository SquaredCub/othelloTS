import React from "react";
import { State } from "../logic/state";
import { isMoveLegal } from "../logic/checks";
//. TYPES DEFINITION .
interface Props {
  board: number[][];
  canPlay: boolean;
  state: State;
  dispatch: React.Dispatch<any>;
  winner: string;
}
//. PAWS DEFINITION .
const WhitePawn = () => <div className="wP"></div>;
const BlackPawn = () => <div className="bP"></div>;
//. JSX .
const Board = ({ board, state, dispatch, winner }: Props) => {
  const handleCellClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    //* Defining arguments for checks .
    const position = target.id.split(",").map((el) => parseInt(el));
    const color = state.whosTurn;
    const currentBoard = state.board;
    //* Taking action :
    const move = isMoveLegal({ position, color, currentBoard });
    if (move.status) {
      dispatch({ type: "move", payload: { position, color } });
      dispatch({
        type: "convert",
        payload: { pawnsToTurn: move.pawnsTurned, color: color },
      });
      dispatch({ type: "switchPlayer" });
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
              {/* <span className="tooltip">{`${lineIndex},${cellIndex}`}</span> */}
            </div>
          ))
        )}
      </div>
      {state.isGameOver && (
        <div id="gameOverScreen">
          <h2>Game Over</h2>
          <h1>{winner} Won</h1>
        </div>
      )}
      {!state.isPlaying && <div id="gamePausedScreen">Game Paused</div>}
    </div>
  );
};

export default Board;
