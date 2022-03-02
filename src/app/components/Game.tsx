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
  const [legalMoves, setLegalMoves] = useState<number[][]>([]);
  const colors = [0, "White", "Black"];
  //. OBSERVING STATE .
  useEffect(() => {
    //* We measure the score :
    const blackScore = findScore(2, state.board);
    setBlackScore(blackScore);
    const whiteScore = findScore(1, state.board);
    setWhiteScore(whiteScore);
    //* Early exit if the game is over or we're not playing
    if (state.isGameOver || !state.isPlaying) return;

    //* Checking if the player still has a legal move
    const legalReturn = isThereAnyLegalMoves(state.board, state.whosTurn);
    //* If not, we check if the opponent can still play
    if (!legalReturn) {
      setLegalMoves([]);
      const otherPlayer = state.whosTurn === 2 ? 1 : 2;
      //* If nobody can play -> Game over
      if (!isThereAnyLegalMoves(state.board, otherPlayer)) {
        dispatch({ type: "gameOver" });
        //* Otherwise we alert the player he can't play and that the opponent's turn will come instead
      } else {
        alert("Switching player because you have no legal moves");
        dispatch({ type: "switchPlayer" });
      }
    } else {
      //* If there's still legal moves, we store them in the state
      setLegalMoves(legalReturn);
    }
    //* Then we check who's turn it is :
    if (state.isPlaying && state.whosTurn === 2) {
      document.querySelector(".boardContainer")?.classList.add("active");
    } else {
      //document.querySelector(".boardContainer")?.classList.remove("active");
      //makeAiPlay();
    }
  }, [state]);
  //. RETURN STATEMENT .
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
        legalMoves={legalMoves}
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
