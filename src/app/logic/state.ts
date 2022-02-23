//* TYPES DEFINITION .
interface ActionType {
  type: string;
  payload?: boolean;
}
//* INITIAL STATE .
class InitialState {
  isPlaying: boolean;
  whosTurn: string;
  isGameOver: boolean;
  shouldRestart: boolean;
  board: { [k: string]: number[] };
  constructor(
    isPlaying: boolean = false,
    whosTurn: string = "black",
    isGameOver: boolean = false,
    shouldRestart: boolean = false,
    board: { [k: string]: number[] } = {
      0: [0, 0, 0, 0, 0, 0, 0, 0],
      1: [0, 0, 0, 0, 0, 0, 0, 0],
      2: [0, 0, 0, 0, 0, 0, 0, 0],
      3: [0, 0, 0, 1, 2, 0, 0, 0],
      4: [0, 0, 0, 2, 1, 0, 0, 0],
      5: [0, 0, 0, 0, 0, 0, 0, 0],
      6: [0, 0, 0, 0, 0, 0, 0, 0],
      7: [0, 0, 0, 0, 0, 0, 0, 0],
    }
  ) {
    this.isPlaying = isPlaying;
    this.whosTurn = whosTurn;
    this.isGameOver = isGameOver;
    this.shouldRestart = shouldRestart;
    this.board = board;
  }
  canPlay() {
    return this.isPlaying && this.whosTurn === "black";
  }
}
const initialState = new InitialState(false);
//* REDUCER .
const reducer = (state: InitialState, action: ActionType) => {
  switch (action.type) {
    case "start":
      return new InitialState(!state.isPlaying);
    case "gameOver":
      return { ...state, isGameOver: !state.isGameOver };
    case "restart":
      return { ...state, shouldRestart: !state.shouldRestart };
    default:
      return state;
  }
};

export { reducer, initialState };
