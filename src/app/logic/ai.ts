import { Dispatch } from "react";
import { isThereAnyLegalMoves, moveOutput } from "./checks";
import { avoid, target } from "./constants";

const makeAiPlay = (
  dispatch: Dispatch<any>,
  board: number[][],
  color: number,
  setMoveIt: any,
  queue: any
) => {
  const currentBoard = board;
  const moves = isThereAnyLegalMoves(currentBoard, color);
  if (!moves) return;
  //* Make array of score per move .
  const calculations = moves.map((move) => {
    let totalScore;
    let takingScore; // 1-10
    let centerScore; // 1-3
    let targetScore; // 0 || 10
    let avoidScore; // 0 || 10
    const position = move;
    const color = 1;
    const moveResults = moveOutput({ position, color, currentBoard })
      .takes as number[][];
    if (!moveResults) return;

    takingScore = moveResults.length > 10 ? 10 : moveResults.length;

    const isInAvoid = avoid.some((avoidPos) =>
      avoidPos.every((posNumber, index) => posNumber === position[index])
    );
    avoidScore = isInAvoid ? 0 : 10;

    const isInTarget = target.some((targetPos) =>
      targetPos.every((posNumber, index) => posNumber === position[index])
    );
    targetScore = isInTarget ? 10 : 0;
    totalScore = avoidScore + targetScore + takingScore;
    /* const distanceFromBlock = move[0] < 7 - move[0] ? move[0] : 7 - move[0];
    const distanceFromInline = move[1] < 7 - move[1] ? move[1] : 7 - move[1]; */
    return totalScore;
  });
  //* Find the maximum score from the array .
  const maxCalculation = calculations.reduce(
    //@ts-ignore
    (acc, score) => (score > acc ? score : acc),
    0
  );
  //* Define it's index
  const indexOfMax = calculations.indexOf(maxCalculation);
  //* And finally, get the position from the max scoring move .
  const position = moves[indexOfMax];
  const actions = [
    { type: "animate" },
    { type: "move", payload: { position, color } },
    {
      type: "convert",
      payload: {
        pawnsToTurn: moveOutput({ position, color, currentBoard }).takes,
        color: color,
      },
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
    payload: {
      pawnsToTurn: moveOutput({ position, color, currentBoard }).takes,
      color: color,
    },
  });
  dispatch({ type: "switchPlayer" });
  dispatch({ type: "animateStop" });
};

export { makeAiPlay };
