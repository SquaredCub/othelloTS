import { vectors } from "./constants";

//. TYPE DEFINITIONS .
interface Args {
  position: number[];
  color: number;
  currentBoard: number[][];
  moveTakes?: number[][];
}
//. CELL TAKEN CHECK .
const isCellTaken = ({ position, color, currentBoard }: Args) => {
  if (currentBoard[position[0]][position[1]] !== 0) return true;
  return currentBoard[position[0]][position[1]];
};

//. Vector checking .
const moveOutput = ({
  position,
  color,
  currentBoard,
}: Args): { takes: boolean | number[][]; error: string } => {
  let takes: boolean | number[][] = false;
  let error = "Illegal move : ";
  if (isCellTaken({ position, color, currentBoard })) return { takes, error };
  let vectorTakes: (false | number[][])[] = [];
  const opponentColor = color === 2 ? 1 : 2;
  //.Loop through vectors
  for (let vector in vectors) {
    const returnFaultyVector = () => vectorTakes.push(false);

    let tempCellValues: (number | number[])[][] = [];
    //. Loop through cells in vector direction
    for (let x = 1; x <= 7; x++) {
      //* Early break if vector leads outside of board area :
      if (!currentBoard[position[0] + vectors[vector][0] * x]) break;
      if (
        !currentBoard[position[0] + vectors[vector][0] * x][
          position[1] + vectors[vector][1] * x
        ]
      )
        break;

      //* Getting value of cell
      const cellValue =
        currentBoard[position[0] + vectors[vector][0] * x][
          position[1] + vectors[vector][1] * x
        ];
      const cellPosition = [
        position[0] + vectors[vector][0] * x,
        position[1] + vectors[vector][1] * x,
      ];

      //* Early break if there is no opponent as first cell of this vector
      if (x === 1 && cellValue !== opponentColor) break;

      //* Only then, do we record cell values
      tempCellValues.push([cellValue, cellPosition]);
    }
    //* If the vector holds no value, we return a faulty vector immediately
    if (tempCellValues.length === 0) {
      returnFaultyVector();
      continue;
    }
    //* If the vector doesn't have friends to take with, we return a faulty vector immediately
    const valuesOnly = tempCellValues.map((cell) => cell[0]);
    if (!valuesOnly.includes(color)) {
      returnFaultyVector();
      continue;
      //* Otherwise, we get the index of the friend and check if everything in between is the opponent's color.
    } else {
      const indexOfFriend = valuesOnly.indexOf(color);
      // . By this point, we know that the vector has a friend to take and at least an opponent next to him
      //* Now we check every pawn in the line to make sure there is a "WRAP" :
      const valuesChecked = valuesOnly.map((cell, index) => {
        if (index > indexOfFriend) return "toofar";
        if (index === indexOfFriend) return "friend";
        if (cell === opponentColor) return "foe";
        return "error";
      });
      //* Exit if a cell computed to error (which means it was not a foe and was before the friend in view)
      if (valuesChecked.includes("error")) {
        returnFaultyVector();
        continue;
        //* Otherwise the move MUST take a pawn so we compute the position of every "foe" in valuesChecked array
      } else {
        let tempPositionOfTakenCells: number[][] = [];
        valuesChecked.forEach((cell, index) => {
          if (cell === "foe" && index < indexOfFriend) {
            tempPositionOfTakenCells.push(tempCellValues[index][1] as number[]);
          }
        });
        vectorTakes.push(tempPositionOfTakenCells);
      }
    }
  }
  //. End of vector checking. Results are in vectorTakes
  //. For each vector, we either get FALSE if vector does not take, or we get an array of positions to take. (vectorTakes is always 8 in length)
  const setOfNumberArrays = new Set(vectorTakes);

  if (setOfNumberArrays.size > 1) {
    takes = [];
    setOfNumberArrays.forEach((vectorsArray) => {
      if (vectorsArray === false) return;
      // @ts-ignore
      vectorsArray.forEach((positionArray) => takes.push(positionArray));
    });
  }
  return { takes, error };
};

//. GAME OVER CHECK .
const isThereAnyLegalMoves = (currentBoard: number[][], color: number) => {
  const legalMoves: number[][] = [];
  currentBoard.forEach((line, lineIndex) => {
    line.forEach((cell, cellIndex) => {
      const position = [lineIndex, cellIndex];
      if (moveOutput({ position, color, currentBoard }).takes !== false) {
        legalMoves.push(position);
      }
    });
  });
  if (legalMoves.length > 0) return legalMoves;
  return false;
};

export { isThereAnyLegalMoves, moveOutput };

// 12.35€
