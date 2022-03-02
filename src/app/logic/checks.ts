import { vectors } from "./constants";

//. TYPE DEFINITIONS .
interface Args {
  position: number[];
  color: number;
  currentBoard: number[][];
  moveTakes?: number[][];
}
interface Response {
  status: boolean;
  errorMessage: string;
  pawnsTurned: number[][];
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
//. COLOR IN A LINE CHECK .
const hasColorMatchInLine = ({
  position,
  color,
  currentBoard,
}: Args): false | number[][] => {
  //* Horizontal Check :
  let matches: number[][] = [];
  for (let x = 0; x < 8; x++) {
    if (currentBoard[position[0]][x] === color) matches.push([position[0], x]);
  }
  //* Vertical Check :
  for (let y = 0; y < 8; y++) {
    if (currentBoard[y][position[1]] === color) matches.push([y, position[1]]);
  }

  //* TopLeft Diagonal Check :
  const findTopLeftDiagOrigin = (position: number[]) => {
    let diagOrigin = position;
    if (diagOrigin[0] === 0 || diagOrigin[1] === 0) return diagOrigin;

    for (let x = 0; x < 7; x++) {
      diagOrigin = [position[0] - x, position[1] - x];
      if (diagOrigin[0] === 0 || diagOrigin[1] === 0) break;
    }

    return diagOrigin;
  };
  const topLeft = findTopLeftDiagOrigin(position);
  for (let x = 0; x <= 7; x++) {
    if (currentBoard[topLeft[0] + x] === undefined) break;
    if (currentBoard[topLeft[0] + x][topLeft[1] + x] === undefined) break;
    const posValue = currentBoard[topLeft[0] + x][topLeft[1] + x];
    if (posValue === color) matches.push([topLeft[0] + x, topLeft[1] + x]);
  }
  //* TopRight Diagonal Check :
  const findTopRightDiagOrigin = (position: number[]) => {
    let diagOrigin = position;
    if (diagOrigin[0] === 0 || diagOrigin[1] === 7) return diagOrigin;

    for (let x = 0; x <= 7; x++) {
      diagOrigin = [position[0] - x, position[1] + x];
      if (diagOrigin[0] === 0 || diagOrigin[1] === 7) break;
    }

    return diagOrigin;
  };
  const topRight = findTopRightDiagOrigin(position);
  for (let x = 0; x <= 7; x++) {
    if (currentBoard[topRight[0] + x] === undefined) break;
    if (currentBoard[topRight[0] + x][topRight[1] - x] === undefined) break;
    const posValue = currentBoard[topRight[0] + x][topRight[1] - x];
    if (posValue === color) matches.push([topRight[0] + x, topRight[1] - x]);
  }
  //* Checking the results :
  if (matches.length > 0) return matches;
  return false;
};

//. ADJACENT OPPONENT CHECK .
const isOpponentAdjacent = ({ position, color, currentBoard }: Args) => {
  //* Function that will check the value of a cell from current position + vector .
  const getAdjacentValue = (vector: number[]) => {
    let x = vector[0];
    let y = vector[1];
    let value = currentBoard[position[0] + x]
      ? currentBoard[position[0] + x][position[1] + y]
        ? currentBoard[position[0] + x][position[1] + y]
        : undefined
      : undefined;
    return value;
  };
  //* Looping through all neighbors and logging positions with adjacent opponent .
  const vectorNames = Object.keys(vectors);
  let matches: number[][] = [];
  for (let x = 0; x < Object.keys(vectors).length; x++) {
    const value = getAdjacentValue(vectors[vectorNames[x]]);
    if (value !== 0 && value !== undefined && value !== color) {
      matches.push([
        position[0] + vectors[vectorNames[x]][0],
        position[1] + vectors[vectorNames[x]][1],
      ]);
    }
  }
  //* Checking the results .
  if (matches.length > 0) return matches;
  return false;
};

//. MOVE IS TAKING OPPONENT PAWNS CHECK .
const isMoveTaking = ({
  position,
  color,
  currentBoard,
}: Args): number[][] | false => {
  const cellTaken = isCellTaken({ position, color, currentBoard });
  const friendsInLine = hasColorMatchInLine({ position, color, currentBoard });
  const adjacentOpponents = isOpponentAdjacent({
    position,
    color,
    currentBoard,
  });

  if (!friendsInLine) return false;
  if (!adjacentOpponents) return false;
  if (cellTaken) return false;

  const findVector = (pos: number[], friendPos: number[]) => {
    let vertical: number;
    let horizontal: number;

    if (pos[0] < friendPos[0]) {
      vertical = 1;
    } else if (pos[0] > friendPos[0]) {
      vertical = -1;
    } else vertical = 0;
    if (pos[1] < friendPos[1]) {
      horizontal = 1;
    } else if (pos[1] > friendPos[1]) {
      horizontal = -1;
    } else horizontal = 0;

    return [vertical, horizontal];
  };

  //*Recording vectors of friends;
  let friendsVectors: number[][] = [];
  friendsInLine.forEach((friendPos) => {
    const vector = findVector(position, friendPos);
    friendsVectors.push(vector);
  });
  //*Recording vectors of opponents;
  let opponentsVectors: number[][] = [];
  adjacentOpponents.forEach((opponent) => {
    const vector = findVector(position, opponent);
    opponentsVectors.push(vector);
  });

  //* Matching all vectors to see if some match
  const equals = (a: number[], b: number[]) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  const vectorsThatScore = opponentsVectors.filter((opponentVector) => {
    if (
      friendsVectors.filter((friendVector) => {
        if (equals(friendVector, opponentVector)) return true;
      }).length > 0
    )
      return true;
  });
  if (vectorsThatScore.length === 0) return false;
  else return vectorsThatScore;
};

//. IS IT LEGAL CHECK .
const isMoveLegal = ({ position, color, currentBoard }: Args) => {
  let answer: Response = {
    status: false,
    errorMessage: "%cInvalid move : %c",
    pawnsTurned: [],
  };
  const cellTaken = isCellTaken({ position, color, currentBoard });
  if (cellTaken) answer.errorMessage += "Cell is already taken";

  const friendsInLine = hasColorMatchInLine({ position, color, currentBoard });
  if (!friendsInLine) answer.errorMessage += "No friends in line";

  const opponentAdjacent = isOpponentAdjacent({
    position,
    color,
    currentBoard,
  });
  if (!opponentAdjacent) answer.errorMessage += "There is no adjacent opponent";

  const findPawnsToTurn = ({
    position,
    color,
    currentBoard,
    moveTakes,
  }: Args): number[][] => {
    let pawnsToTurn: number[][] = [];
    if (!moveTakes) return pawnsToTurn;
    moveTakes.forEach((vector) => {
      let tempPawns: number[][] = [];
      for (let x = 1; x < 7; x++) {
        const posValue =
          currentBoard[position[0] + vector[0] * x][
            position[1] + vector[1] * x
          ];
        if (posValue !== undefined && posValue !== color) {
          tempPawns.push([
            position[0] + vector[0] * x,
            position[1] + vector[1] * x,
          ]);
        } else {
          break;
        }
      }
      let tempCheck = true;
      tempPawns.forEach((pos) => {
        if (currentBoard[pos[0]][pos[1]] === 0) tempCheck = false;
      });
      if (!tempCheck) return;
      tempPawns.forEach((pos) => pawnsToTurn.push(pos));
    });
    return pawnsToTurn;
  };

  const moveTakes = isMoveTaking({ position, color, currentBoard });
  if (!moveTakes)
    answer.errorMessage += "This move does not take any opponent pawn";
  else {
    const pawnsToTurn = findPawnsToTurn({
      position,
      color,
      moveTakes,
      currentBoard,
    });
    if (pawnsToTurn.length === 0) {
      answer.errorMessage += "This move does not take any opponent pawn";
    } else {
      answer.status = true;
      answer.pawnsTurned = pawnsToTurn;
    }
  }

  return answer;
};

//. GAME OVER CHECK .
const isThereAnyLegalMoves = (currentBoard: number[][], color: number) => {
  const log = "%cChecking if GameOver : ";
  for (let x = 0; x < 7; x++) {
    for (let y = 0; y < 8; y++) {
      const position = [x, y];
      if (moveOutput({ position, color, currentBoard }).takes !== false) {
        return true;
      }
    }
  }
  return false;
};

export { isMoveLegal, isThereAnyLegalMoves, moveOutput };

// 12.35€
