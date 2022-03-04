import React, { useEffect, useReducer, useState, useRef } from "react";
import { reducer, initialState } from "../logic/state";
import { isThereAnyLegalMoves } from "../logic/checks";
import { makeAiPlay } from "../logic/ai";
import { findScore } from "../logic/score";
import { WhitePawn, BlackPawn } from "./Pawns";
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
  const [previousState, setPreviousState] = useState<number[][][]>([]);
  const [selectedState, setSelectedState] = useState(0);
  const colors = [0, "White", "Black"];

  const prevBtn = useRef(null);
  const nextBtn = useRef(null);
  //. OBSERVING STATE .
  useEffect(() => {
    //* Early exit if the game is over or we're not playing
    if (state.isGameOver || !state.isPlaying) return;
    setPreviousState((old) => [...old, state.board]);
    //* We measure the score :
    const blackScore = findScore(2, state.board);
    setBlackScore(blackScore);
    const whiteScore = findScore(1, state.board);
    setWhiteScore(whiteScore);

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
          `Switching ${
            colors[state.whosTurn]
          }'s turn because he has no legal moves`
        );
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
      document.querySelector(".boardContainer")?.classList.remove("active");
      makeAiPlay(dispatch, state.board, 1);
    }
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
    if (e.target?.id === "leftBtn") goLeft();
    //@ts-ignore
    if (e.target?.id === "rightBtn") goRight();
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);
  const goLeft = () => {
    setSelectedState((old) => (old === 0 ? old : old - 1));
  };
  const goRight = () => {
    setSelectedState((old) =>
      old === previousState.length - 1 ? old : old + 1
    );
  };
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
      </div>
      {/* SCORE DISPLAY */}
      <div className="scoreContainer">
        <h2>Score</h2>
        <div>Black : {blackScore} pawns</div>
        <div>White : {whiteScore} pawns</div>
      </div>
      {/* CHEAT INSPECTOR CONTROLS */}
      <div className="cheatInspector">
        <h2>Cheat Inspector</h2>
        {/* CHEAT INSPECTOR CONTROLS */}
        <div className="prevSelector">
          <div className="prevSelector__info">
            Turn n°{selectedState}/
            {previousState.length - 1 < 0 ? 0 : previousState.length - 1}
          </div>
          <div className="prevSelector__controls">
            <span
              //@ts-ignore
              onClick={handleClick}
              style={{ cursor: "pointer" }}
              id={"leftBtn"}
              ref={prevBtn}
            >
              {"<"}
            </span>
            <span
              //@ts-ignore
              onClick={handleClick}
              style={{ cursor: "pointer" }}
              id={"rightBtn"}
              ref={nextBtn}
            >
              {">"}
            </span>
          </div>
        </div>
        {/* CHEAT INSPECTOR */}
        <div className="prev">
          {previousState.length > 0 &&
            previousState[selectedState].map(
              (line: number[], lineIndex: number) =>
                line.map((cell: number, cellIndex: number) => {
                  const pos = [lineIndex, cellIndex];
                  return (
                    <div
                      key={"d" + pos.toString()}
                      className={"cell"}
                      id={pos.toString()}
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
      </div>
    </div>
  );
};

export default Game;
