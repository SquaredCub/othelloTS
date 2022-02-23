import React, { useEffect, useReducer } from "react";
import { reducer, initialState } from "../logic/state";
import Board from "./Board";

//. PAWS DEFINITION .
const WhitePawn = () => <div className="wP"></div>;
const BlackPawn = () => <div className="bP"></div>;
//. Component .
const Game = () => {
  //* STATE DEFINITION .
  const [state, dispatch] = useReducer<React.Reducer<any, any>>(
    reducer,
    initialState
  );
  //* OBSERVING STATE .
  useEffect(() => {
    if (state.isPlaying === true && state.whosTurn === "black") {
      document.querySelector(".boardContainer")?.classList.add("active");
    }
    if (state.isPlaying === false || state.whosTurn === "white") {
      document.querySelector(".boardContainer")?.classList.remove("active");
    }
  }, [state]);
  //* BUTTONS HANDLERS .
  const handleGameOver = () => {
    dispatch({ type: "gameOver" });
  };
  const handleRestart = () => {
    dispatch({ type: "restart" });
  };
  const handleStart = () => {
    dispatch({ type: "start" });
  };
  //* RETURN STATEMENT .
  return (
    <div>
      {/* ACTUAL BOARD */}
      <Board board={state.board} canPlay={state.canPlay()} />
      <div className="stateDisplay">
        {/* STATE DISPLAY */}
        <h3>State: </h3>
        <div>
          isPlaying : {state.isPlaying.toString()}{" "}
          <button type="button" onClick={handleStart}>
            Start Game | Pause Game
          </button>
        </div>
        <div>
          IsGameOver : {state.isGameOver.toString()}{" "}
          <button type="button" onClick={handleGameOver}>
            SWITCH
          </button>
        </div>
        <div>
          ShouldRestart : {state.shouldRestart.toString()}{" "}
          <button type="button" onClick={handleRestart}>
            SWITCH
          </button>
        </div>
        <div>Who's turn is it : {state.whosTurn}</div>
        <div>
          BoardState :{" "}
          {Object.keys(state.board).map((el, index) => (
            <div key={index}>{state.board[el]}</div>
          ))}
        </div>
        <div>Can you play : {state.canPlay().toString()}</div>
      </div>
    </div>
  );
};

export default Game;
