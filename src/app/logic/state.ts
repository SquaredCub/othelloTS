//* TYPES DEFINITION .
interface ActionType {
  type: string;
  payload?: {
    position: number[];
    color: number;
  };
}
export interface State {
  isPlaying: boolean;
  whosTurn: number;
  isGameOver: boolean;
  shouldRestart: boolean;
  board: number[][];
}
//* INITIAL STATE .
const initialState: State = {
  isPlaying: false,
  whosTurn: 2,
  isGameOver: false,
  shouldRestart: false,
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
  switch (action.type) {
    case "start":
      return { ...state, isPlaying: !state.isPlaying };
    case "gameOver":
      return { ...state, isGameOver: !state.isGameOver };
    case "restart":
      return { ...initialState, isPlaying: true };
    case "switchPlayer":
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
    default:
      return state;
  }
};

export { reducer, initialState };
