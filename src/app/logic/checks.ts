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
      if (isMoveLegal({ position, color, currentBoard }).status) {
        return true;
      }
    }
  }
  return false;
};

export { isMoveLegal, isThereAnyLegalMoves };

// 12.35€
