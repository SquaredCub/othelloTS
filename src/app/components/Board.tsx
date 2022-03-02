import React from "react";
import { State } from "../logic/state";
import { moveOutput } from "../logic/checks";
//. TYPES DEFINITION .
interface Props {
  board: number[][];
  canPlay: boolean;
  state: State;
  dispatch: React.Dispatch<any>;
  winner: string;
  legalMoves: number[][];
}
//. PAWS DEFINITION .
const WhitePawn = () => <div className="wP"></div>;
const BlackPawn = () => <div className="bP"></div>;
//. JSX .
const Board = ({ board, state, dispatch, winner, legalMoves }: Props) => {
  const handleCellClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    //* Defining arguments for checks .
    const position = target.id.split(",").map((el) => parseInt(el));

    const color = state.whosTurn;
    const currentBoard = state.board;
    //* Taking action :
    const move = moveOutput({ position, color, currentBoard });
    if (!move.takes) return;
    dispatch({ type: "move", payload: { position, color } });
    dispatch({
      type: "convert",
      payload: { pawnsToTurn: move.takes, color: color },
    });
    dispatch({ type: "switchPlayer" });
  };
  return (
    <div className="boardContainer">
      <div className="board">
        {board.map((line, lineIndex) =>
          line.map((cell, cellIndex) => {
            const pos = [lineIndex, cellIndex];
            let matching = false;
            legalMoves.forEach((legalPos) => {
              const match = legalPos.every((element, index) => {
                return element === pos[index];
              });
              if (match) matching = true;
            });
            return (
              <div
                key={pos.toString()}
                className={matching ? "cell legal" : "cell"}
                id={pos.toString()}
                onClick={handleCellClick}
              >
                {cell ? cell === 1 ? <WhitePawn /> : <BlackPawn /> : null}
                {/* DEVELOPER HELP */}
                {/* <span
                  className="tooltip"
                  style={{ color: "black" }}
                >{`${lineIndex},${cellIndex}`}</span> */}
              </div>
            );
          })
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
