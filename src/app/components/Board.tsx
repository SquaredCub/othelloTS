import React from "react";
import { State } from "../logic/state";
import { moveOutput } from "../logic/checks";
import { WhitePawn, BlackPawn } from "./Pawns";
//. TYPES DEFINITION .
interface Props {
  board: number[][];
  canPlay: boolean;
  state: State;
  dispatch: React.Dispatch<any>;
  winner: string;
  legalMoves: number[][];
  queue: any;
  setMoveIt: any;
}
//. Component .
const Board = ({
  board,
  state,
  dispatch,
  winner,
  legalMoves,
  queue,
  setMoveIt,
}: Props) => {
  const handleCellClick = async (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    //* Defining arguments for checks .
    const position = target.id.split(",").map((el) => parseInt(el));

    const color = state.whosTurn;
    const currentBoard = state.board;
    //* Taking action :
    const move = moveOutput({ position, color, currentBoard });
    if (!move.takes || move.takes === true) return;
    /* let converts;
    if (move.takes.length > 0) {
      converts = move.takes.map((pos: number[]) => {
        return {
          type: "convert",
          payload: { pawnsToTurn: pos, color: color },
        };
      });
    } else {
      converts = move.takes[0];
    } */
    const actions = [
      { type: "animate" },
      { type: "move", payload: { position, color } },
      {
        type: "convert",
        payload: { pawnsToTurn: move.takes, color: color },
      },
      { type: "switchPlayer" },
      { type: "animateStop" },
    ];
    queue.current = actions;
    setMoveIt(true);
    return;
    dispatch({ type: "animate" });
    dispatch({ type: "move", payload: { position, color } });
    dispatch({
      type: "convert",
      payload: { pawnsToTurn: move.takes, color: color },
    });
    dispatch({ type: "switchPlayer" });
    dispatch({ type: "animateStop" });
  };
  //. JSX .
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
