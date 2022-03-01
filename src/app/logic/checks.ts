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
  if (currentBoard[position[0]][position[1]] === 0) return false;
  return currentBoard[position[0]][position[1]];
};

//. COLOR IN A LINE CHECK .
const hasColorMatchInLine = ({
  position,
  color,
  currentBoard,
}: Args): false | number[][] => {
  //* Horizontal Check :
  let matches: number[][] = [];
  for (let x = 0; x < 7; x++) {
    if (currentBoard[position[0]][x] === color) matches.push([position[0], x]);
  }
  //* Vertical Check :
  for (let y = 0; y < 7; y++) {
    if (currentBoard[y][position[1]] === color) matches.push([y, position[1]]);
  }

  //* Diagonal Check (top to bottom):
  const findTopToBottomDiagOrigin = (position: number[]) => {
    let diagOrigin: number[] = [];
    for (let x = 0; x < 7; x++) {
      diagOrigin = [position[0] - x, position[1] - x];
      if (position[0] - x === 0) break;
      if (position[1] - x === 0) break;
    }
    return diagOrigin;
  };
  const topToBottomDiagOrigin = findTopToBottomDiagOrigin(position);
  for (let x = 0; x < 7; x++) {
    if (topToBottomDiagOrigin[0] + x === 7) break;
    if (topToBottomDiagOrigin[1] + x === 7) break;
    if (
      currentBoard[topToBottomDiagOrigin[0] + x][
        topToBottomDiagOrigin[1] + x
      ] === color
    )
      matches.push([
        topToBottomDiagOrigin[0] + x,
        topToBottomDiagOrigin[1] + x,
      ]);
  }
  //* Diagonal Check (bottom to top) :
  const findBottomToTopDiagOrigin = (position: number[]) => {
    let diagOrigin: number[] = [];
    for (let x = 0; x < 7; x++) {
      diagOrigin = [position[0] + x, position[1] - x];
      if (position[0] + x === 7) break;
      if (position[1] - x === 0) break;
    }
    return diagOrigin;
  };
  const bottomToTopDiagOrigin = findBottomToTopDiagOrigin(position);
  for (let x = 0; x < 7; x++) {
    if (bottomToTopDiagOrigin[0] - x === 0) break;
    if (bottomToTopDiagOrigin[1] + x === 7) break;
    if (
      currentBoard[bottomToTopDiagOrigin[0] - x][
        bottomToTopDiagOrigin[1] + x
      ] === color
    ) {
      const coord: number[] = [
        bottomToTopDiagOrigin[0] - x,
        bottomToTopDiagOrigin[1] + x,
      ];
      matches.push(coord);
    }
  }
  //* Checking the results :
  if (matches.length > 0) return matches;
  return false;
};

//. ADJACENT OPPONENT CHECK .
const isOpponentAdjacent = ({ position, color, currentBoard }: Args) => {
  //* Declaring vectors to find out each neighbor .
  const vectors: { [key: string]: number[] } = {
    topLeft: [-1, -1],
    top: [-1, 0],
    topRight: [-1, 1],
    right: [0, 1],
    bottomRight: [1, 1],
    bottom: [1, 0],
    bottomLeft: [1, -1],
    left: [0, -1],
  };
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
  //console.log("%cAdjacent matches : ", "color: salmon");
  //console.log(matches);
  //* Checking the results .
  if (matches.length > 0) return matches;
  return false;
};

//. MOVE IS TAKING OPPONENT PAWNS CHECK .
const isMoveTaking = ({ position, color, currentBoard }: Args) => {
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
const isMoveLegal = ({ position, color, currentBoard }: Args): Response => {
  let answer: Response = {
    status: false,
    errorMessage: "%cInvalid move : %c",
    pawnsTurned: [],
  };
  const cellFree = isCellTaken({ position, color, currentBoard });
  if (!cellFree) answer.errorMessage += "Cell is already taken";

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
  }: Args) => {
    let pawnsToTurn: number[][] = [];
    if (!moveTakes) return pawnsToTurn;
    moveTakes.forEach((vector) => {
      for (let x = 0; x < 7; x++) {
        const posValue =
          currentBoard[position[0] + vector[0] * x][
            position[1] + vector[1] * x
          ];
        if (posValue !== undefined && posValue !== 0 && posValue !== color)
          pawnsToTurn.push([
            position[0] + vector[0] * x,
            position[1] + vector[1] * x,
          ]);
      }
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
    answer.status = true;
    answer.pawnsTurned = pawnsToTurn;
  }

  return answer;
};

//. GAME OVER CHECK .
const isThereAnyLegalMoves = (currentBoard: number[][], color: number) => {
  const log = "%cChecking if GameOver : ";
  for (let x = 0; x < 7; x++) {
    for (let y = 0; y < 8; y++) {
      const position = [x, y];
      console.log("Checking position : " + position.toString());
      if (isMoveLegal({ position, color, currentBoard }).status) {
        console.log(
          log + "%cThere is at least one more possibilty",
          "color: white",
          "color: green"
        );
        return true;
      }
    }
  }
  console.log(
    log + "%cThere is no more possible moves. Game Over",
    "color: white",
    "color: red"
  );
  return false;
};

export { isMoveLegal, isThereAnyLegalMoves };

// 12.35€
