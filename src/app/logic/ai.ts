import { Dispatch } from "react";
import { isThereAnyLegalMoves, moveOutput } from "./checks";
import { avoid, target } from "./constants";

const makeAiPlay = (
  dispatch: Dispatch<any>,
  board: number[][],
  color: number
) => {
  const currentBoard = board;
  const moves = isThereAnyLegalMoves(currentBoard, color);
  if (!moves) return;

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
  const maxCalculation = calculations.reduce(
    //@ts-ignore
    (acc, score) => (score > acc ? score : acc),
    0
  );
  const indexOfMax = calculations.indexOf(maxCalculation);
  const position = moves[indexOfMax];

  dispatch({ type: "move", payload: { position, color } });
  dispatch({
    type: "convert",
    payload: {
      pawnsToTurn: moveOutput({ position, color, currentBoard }).takes,
      color: color,
    },
  });
  dispatch({ type: "switchPlayer" });
};

export { makeAiPlay };
