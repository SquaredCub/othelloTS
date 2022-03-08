import React from "react";
import { State } from "../logic/state";
import { moveOutput } from "../logic/checks";
import { WhitePawn, BlackPawn, NewWhitePawn, NewBlackPawn } from "./Pawns";
//. TYPES DEFINITION .
interface Props {
  board: number[][];
  canPlay: boolean;
  state: State;
  winner: string;
  legalMoves: number[][];
  setQueue: any;
}
//. Component .
const Board = ({ board, state, winner, legalMoves, setQueue }: Props) => {
  const handleCellClick = async (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    //* Defining arguments for checks .
    const position = target.id.split(",").map((el) => parseInt(el));

    const color = state.whosTurn;
    const currentBoard = state.board;
    //* Taking action :
    const move = moveOutput({ position, color, currentBoard });
    if (!move.takes || move.takes === true) return;
    const converts = move.takes.map((pos) => {
      return {
        type: "convert",
        payload: { pawnsToTurn: [pos], color },
      };
    });
    const actions = [
      { type: "animate" },
      { type: "move", payload: { position, color } },
      ...converts,
      { type: "eraseAnimation" },
      { type: "switchPlayer" },
      { type: "animateStop" },
    ];
    setQueue(actions);
    return;
  };
  const renderCell = (cell: number) => {
    switch (cell) {
      case 0:
        return null;
      case 1:
        return <WhitePawn />;
      case 2:
        return <BlackPawn />;
      case 3:
        return <NewWhitePawn />;
      case 4:
        return <NewBlackPawn />;
      default:
        return 0;
    }
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
                {renderCell(cell)}
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
