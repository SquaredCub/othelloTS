import React, { useEffect, useReducer, useState } from "react";
import { reducer, initialState } from "../logic/state";
import { isThereAnyLegalMoves } from "../logic/checks";
import { makeAiPlay } from "../logic/ai";
import Board from "./Board";

//. Component .
const Game = () => {
  //* STATE DEFINITION .
  const [state, dispatch] = useReducer<React.Reducer<any, any>>(
    reducer,
    initialState
  );
  //* OBSERVING STATE .
  useEffect(() => {
    /* Is there any legal moves ? 
        If so, 
          if it's the player turn, activate the board and let him make a move
          if not, deactivate the board and make the AI play
        If not, dispatch the gameover action
    */
    if (state.isGameOver) return;
    if (isThereAnyLegalMoves(state.board, state.whosTurn)) {
      if (state.isPlaying && state.whosTurn === 2) {
        document.querySelector(".boardContainer")?.classList.add("active");
      } else {
        document.querySelector(".boardContainer")?.classList.remove("active");
        makeAiPlay();
      }
    } else {
      dispatch({ type: "gameOver" });
    }
  }, [state]);
  //* RETURN STATEMENT .
  return (
    <div>
      {/* CONTROLS */}
      <div className="boardControls">
        <button type="button" onClick={() => dispatch({ type: "start" })}>
          {state.isPlaying ? "Pause Game" : "Start Game"}
        </button>
        {state.isPlaying ? (
          <button type="button" onClick={() => dispatch({ type: "restart" })}>
            {"Restart Game"}
          </button>
        ) : null}
      </div>
      {/* ACTUAL BOARD */}
      <Board
        board={state.board}
        canPlay={state.isPlaying && state.whosTurn === 2}
        state={state}
        dispatch={dispatch}
      />
      <div className="stateDisplay">
        {/* STATE DISPLAY */}
        <h3>State: </h3>
        <div>
          IsGameOver : {state.isGameOver.toString()}{" "}
          <button type="button" onClick={() => dispatch({ type: "gameOver" })}>
            SWITCH
          </button>
        </div>
        <div>
          ShouldRestart : {state.shouldRestart.toString()}{" "}
          <button type="button" onClick={() => dispatch({ type: "restart" })}>
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
        <div>
          Can you play : {(state.isPlaying && state.whosTurn === 2).toString()}
        </div>
      </div>
    </div>
  );
};

export default Game;
