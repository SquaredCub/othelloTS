import { colors } from "./constants";
//* TYPES DEFINITION .
type ActionType = {
  type: string;
  payload?: {
    position: number[];
    color: number;
    pawnsToTurn: number[][];
  };
};
export interface State {
  isPlaying: boolean;
  whosTurn: number;
  isGameOver: boolean;
  shouldRestart: boolean;
  animating: boolean;
  board: number[][];
}
/* 
type Pawn = {
  color: number;
  status: string; // old, new, flipped
  
  old = do nothing
  new = instant placing
  flipped = from !color to color
}
*/
const convert = (color: number) => {
  return color === 2 ? 4 : 3;
};
//* INITIAL STATE .
const initialState: State = {
  isPlaying: false,
  whosTurn: 2,
  isGameOver: false,
  shouldRestart: false,
  animating: false,
  board: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
};
//* REDUCER .
const reducer = (state: State, action: ActionType) => {
  if (!action) return state;
  switch (action.type) {
    case "animate":
      return { ...state, animating: true };
    case "animateStop":
      return { ...state, animating: false };
    case "start":
      return { ...state, isPlaying: !state.isPlaying };
    case "gameOver":
      return { ...state, isGameOver: !state.isGameOver };
    case "restart":
      return { ...initialState, isPlaying: true };
    case "switchPlayer":
      console.log(
        `${colors[state.whosTurn]}'s turn over. Switching to ${
          state.whosTurn === 2 ? colors[1] : colors[2]
        }`
      );
      return { ...state, whosTurn: state.whosTurn === 2 ? 1 : 2 };
    case "move":
      const newBoard = state.board.map((line, lineIndex) =>
        line.map((cell, cellIndex) => {
          if (!action.payload) return cell;
          if (
            lineIndex === action.payload.position[0] &&
            cellIndex === action.payload.position[1]
          ) {
            return action.payload.color;
          }
          return cell;
        })
      );
      return { ...state, board: newBoard };
    case "convert":
      if (!action.payload) return state;
      let turnedBoard: number[][] = [...state.board];
      for (let x = 0; x < action.payload.pawnsToTurn.length; x++) {
        turnedBoard = turnedBoard.map((line, lineIndex) => {
          return line.map((cell, cellIndex) => {
            if (
              lineIndex === action.payload?.pawnsToTurn[x][0] &&
              cellIndex === action.payload?.pawnsToTurn[x][1]
            ) {
              return convert(action.payload.color);
            }
            return cell;
          });
        });
      }
      return { ...state, board: turnedBoard };
    case "eraseAnimation":
      let erasedBoard: number[][] = state.board.map((line, lineIndex) => {
        return line.map((cell, cellIndex) => {
          return cell === 3 ? 1 : cell === 4 ? 2 : cell;
        });
      });
      return { ...state, board: erasedBoard };
    default:
      return state;
  }
};

export { reducer, initialState };
export type { ActionType };
