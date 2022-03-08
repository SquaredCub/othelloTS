import { Dispatch } from "react";
import { isThereAnyLegalMoves, moveOutput } from "./checks";
import { avoid, target } from "./constants";

const makeAiPlay = (
  board: number[][],
  color: number,
  setQueue: React.Dispatch<React.SetStateAction<any[]>>
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
  const move = moveOutput({ position, color, currentBoard });
  if (typeof move.takes === "boolean") return;
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
};

export { makeAiPlay };
