import React, { useEffect, useReducer, useState } from "react";
import { reducer, initialState } from "../logic/state";
import { isThereAnyLegalMoves } from "../logic/checks";
import { makeAiPlay } from "../logic/ai";
import { findScore } from "../logic/score";
import Board from "./Board";

//. Component .
const Game = () => {
  //* STATE DEFINITION .
  const [state, dispatch] = useReducer<React.Reducer<any, any>>(
    reducer,
    initialState
  );
  const [blackScore, setBlackScore] = useState(findScore(2, state.board));
  const [whiteScore, setWhiteScore] = useState(findScore(1, state.board));
  const colors = [0, "White", "Black"];
  //* OBSERVING STATE .
  useEffect(() => {
    const blackScore = findScore(2, state.board);
    setBlackScore(blackScore);
    const whiteScore = findScore(1, state.board);
    setWhiteScore(whiteScore);
    /* Is there any legal moves ? 
        If so, 
          if it's the player turn, activate the board and let him make a move
          if not, deactivate the board and make the AI play
        If not, dispatch the gameover action
    */
    /* document.querySelector(".boardContainer")?.classList.add("active");
    return; */
    if (state.isGameOver || !state.isPlaying) return;
    if (!isThereAnyLegalMoves(state.board, state.whosTurn)) {
      const otherPlayer = state.whosTurn === 2 ? 1 : 2;
      if (!isThereAnyLegalMoves(state.board, otherPlayer))
        dispatch({ type: "gameOver" });
    }
    if (state.isPlaying && state.whosTurn === 2) {
      document.querySelector(".boardContainer")?.classList.add("active");
    } else {
      //document.querySelector(".boardContainer")?.classList.remove("active");
      //makeAiPlay();
    }
  }, [state]);
  //* RETURN STATEMENT .
  return (
    <div className="gameContainer">
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
      {/* GAME INFORMATION */}
      <div className="gameInfo">
        <p>{colors[state.whosTurn]}'s turn</p>
      </div>
      {/* ACTUAL BOARD */}
      <Board
        board={state.board}
        canPlay={state.isPlaying && state.whosTurn === 2}
        state={state}
        dispatch={dispatch}
        winner={blackScore > whiteScore ? "Black" : "White"}
      />
      <div className="scoreContainer">
        <h2>Score : </h2>
        <div>Black : {blackScore} pawns</div>
        <div>White : {whiteScore} pawns</div>
      </div>
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
