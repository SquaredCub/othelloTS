interface Args {
  position: number[];
  color: number;
  currentBoard: number[][];
}
//. CELL TAKEN CHECK .
const isCellTaken = ({ position, color, currentBoard }: Args) => {
  if (currentBoard[position[0]][position[1]] === 0) return false;
  return true;
};

//. COLOR IN A LINE CHECK .
const hasColorMatchInLine = ({ position, color, currentBoard }: Args) => {
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
        topToBottomDiagOrigin[0 + x],
        topToBottomDiagOrigin[1 + x],
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
    )
      matches.push([
        bottomToTopDiagOrigin[0 - x],
        bottomToTopDiagOrigin[1 + x],
      ]);
  }
  //* Checking the results :
  if (matches.length > 0) return true;
  return false;
};

//. ADJACENT OPPONENT CHECK .
const isThereAnAdjacentPawn = ({ position, color, currentBoard }: Args) => {
  //* Direct neighbors .
  const leftCell = currentBoard[position[0]][position[1] - 1]
    ? currentBoard[position[0]][position[1] - 1]
    : undefined;
  const rightCell = currentBoard[position[0]][position[1] + 1]
    ? currentBoard[position[0]][position[1] + 1]
    : undefined;
  const topCell = currentBoard[position[0] - 1]
    ? currentBoard[position[0] - 1][position[1]]
      ? currentBoard[position[0] - 1][position[1]]
      : undefined
    : undefined;
  const bottomCell = currentBoard[position[0] + 1]
    ? currentBoard[position[0] + 1][position[1]]
      ? currentBoard[position[0] + 1][position[1]]
      : undefined
    : undefined;
  //* Diagonal Neighbors
  const topLeftCell = currentBoard[position[0] - 1]
    ? currentBoard[position[0] - 1][position[1] - 1]
      ? currentBoard[position[0] - 1][position[1] - 1]
      : undefined
    : undefined;
  const topRightCell = currentBoard[position[0] - 1]
    ? currentBoard[position[0] - 1][position[1] + 1]
      ? currentBoard[position[0] - 1][position[1] + 1]
      : undefined
    : undefined;
  const bottomLeftCell = currentBoard[position[0] + 1]
    ? currentBoard[position[0] + 1][position[1] - 1]
      ? currentBoard[position[0] + 1][position[1] - 1]
      : undefined
    : undefined;
  const bottomRightCell = currentBoard[position[0] + 1]
    ? currentBoard[position[0] + 1][position[1] + 1]
      ? currentBoard[position[0] + 1][position[1] + 1]
      : undefined
    : undefined;
  //* Making actual check
  const adjacents = [
    leftCell,
    rightCell,
    topCell,
    bottomCell,
    topLeftCell,
    topRightCell,
    bottomLeftCell,
    bottomRightCell,
  ];
  for (let cell of adjacents) {
    if (cell !== 0 && cell !== undefined && cell !== color) {
      return true;
    }
  }
  return false;
};

//. IS IT LEGAL CHECK .
const isMoveLegal = ({
  position,
  color,
  currentBoard,
}: Args): string | true => {
  if (isCellTaken({ position, color, currentBoard }))
    return "Cell is already taken";
  if (!hasColorMatchInLine({ position, color, currentBoard }))
    return "There is no other pawn of your color horizontally and vertically";
  if (!isThereAnAdjacentPawn({ position, color, currentBoard }))
    return "There is no adjacent pawn of the opposite color";
  // Need to check if we're taking pawns still
  return true;
};

//. GAME OVER CHECK .
const isThereAnyLegalMoves = (currentBoard: number[][], color: number) => {
  for (let x = 0; x < 7; x++) {
    for (let y = 0; y < 8; y++) {
      const position = [x, y];
      if (typeof isMoveLegal({ position, color, currentBoard }) === "boolean") {
        console.log(position);
        return true;
      }
    }
  }
  return false;
};

export { isMoveLegal, isThereAnyLegalMoves };

// 12.35€
