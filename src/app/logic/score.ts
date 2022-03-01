const findScore = (color: number, board: number[][]) =>
  board.reduce((acc: number, line: number[]) => {
    const amountPerLine = line.reduce((acc: number, cell: number) => {
      if (cell === color) return acc + 1;
      else return acc;
    }, 0);
    return acc + amountPerLine;
  }, 0);

export { findScore };
