import { CheatInspector } from "./CheatInspector";
import { useEffect, useReducer, useState, useRef } from "react";
import { reducer, initialState } from "../logic/state";
import { isThereAnyLegalMoves } from "../logic/checks";
import { makeAiPlay } from "../logic/ai";
import { findScore } from "../logic/score";
import Scoreboard from "./Scoreboard";
import Board from "./Board";
import TurnInfo from "./TurnInfo";
import DispatchHandler from "./DispatchHandler";
import { colors, AIDELAY } from "../logic/constants";
import { ActionType } from "../logic/state";

//. Component .
const Game = () => {
  //* STATE DEFINITION .
  const [state, dispatch] = useReducer(reducer, initialState);
  const [score, setScore] = useState({ black: 0, white: 0 });
  const [legalMoves, setLegalMoves] = useState<number[][]>([]);
  const [previousState, setPreviousState] = useState<number[][][]>([]);
  const [selectedState, setSelectedState] = useState(0);
  const [moveIt, setMoveIt] = useState(false);
  const prevBtn = useRef(null);
  const nextBtn = useRef(null);
  const timeoutRef = useRef<number>();
  const queueRef = useRef([]);
  //. OBSERVING STATE .
  useEffect(() => {
    //* Early exit if the game is over or we're not playing
    if (state.isGameOver || !state.isPlaying || state.animating) return;
    //* Saving state of board before deciding the rest
    setPreviousState((old) => [...old, state.board]);
    //*
    //* We measure the score :
    const blackScore = findScore(2, state.board);
    const whiteScore = findScore(1, state.board);
    setScore({ black: blackScore, white: whiteScore });
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
        alert(
          `Skipping ${
            colors[state.whosTurn]
          }'s turn because he has no legal moves`
        );
        dispatch({ type: "switchPlayer" });
      }
    } else {
      //* If there's still legal moves, we store them in the state
      setLegalMoves(legalReturn);
      //* Then we check who's turn it is :
      if (state.whosTurn === 2) {
        document.querySelector(".boardContainer")?.classList.add("active");
      } else {
        document.querySelector(".boardContainer")?.classList.remove("active");
        const timeoutId = setTimeout(() => {
          makeAiPlay(dispatch, state.board, 1, setMoveIt, queueRef);
        }, AIDELAY);
        timeoutRef.current = timeoutId;
      }
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [state]);

  //. PUTTING AN EVENT LISTENER FOR keys
  const handleKeyPress = (e: KeyboardEvent) => {
    //@ts-ignore
    if (e.code === "ArrowLeft") prevBtn.current.click();
    //@ts-ignore
    if (e.code === "ArrowRight") nextBtn.current.click();
  };
  const handleClick = (e: MouseEvent) => {
    //@ts-ignore
    if (e.target?.id === "leftBtn")
      setSelectedState((old) => (old === 0 ? old : old - 1));
    //@ts-ignore
    if (e.target?.id === "rightBtn")
      setSelectedState((old) =>
        old === previousState.length - 1 ? old : old + 1
      );
  };
  useEffect(() => {
    console.log("mounted game");
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      console.log("unmounted game");
    };
  }, []);
  //. RETURN STATEMENT .
  return (
    <div className="gameContainer">
      <div className="gameContainer__board">
        {/* CONTROLS */}
        <div className="boardControls">
          <button type="button" onClick={() => dispatch({ type: "start" })}>
            {state.isPlaying ? "Pause Game" : "Start Game"}
          </button>
          {state.isPlaying ? (
            <button
              type="button"
              onClick={() => {
                //@ts-ignore
                setSelectedState(0);
                setPreviousState([]);
                dispatch({ type: "restart" });
              }}
            >
              {"Restart Game"}
            </button>
          ) : null}
        </div>
        {/* GAME INFORMATION */}
        <TurnInfo whosTurn={colors[state.whosTurn] as string} />
        {/* ACTUAL BOARD */}
        <Board
          board={state.board}
          canPlay={state.isPlaying && state.whosTurn === 2}
          state={state}
          dispatch={dispatch}
          winner={score.black > score.white ? "Black" : "White"}
          legalMoves={legalMoves}
          queue={queueRef}
          setMoveIt={setMoveIt}
        />
      </div>
      {/* SCORE DISPLAY */}
      <Scoreboard score={score} />
      {/* CHEAT INSPECTOR CONTROLS */}
      <CheatInspector
        previousState={previousState}
        selectedState={selectedState}
        handleClick={handleClick}
        prevRef={prevBtn}
        nextRef={nextBtn}
      />
      {moveIt && (
        <DispatchHandler
          queue={queueRef.current}
          dispatch={dispatch}
          setMoveIt={setMoveIt}
          setLegalMoves={setLegalMoves}
        />
      )}
    </div>
  );
};

export default Game;
