import "../style/main.scss";

import Game from "./components/Game";

function App() {
  const handleRules = () => {
    const content = document.querySelector(".rules__content");
    if (!content) return;
    content.classList.toggle("active");
  };
  return (
    <>
      <main>
        <h1>Othello</h1>
        <div className="rules">
          <h3 className="rules__title" onClick={handleRules}>
            Rules
          </h3>
          <div className="rules__content">
            <h3>Goal of the game : </h3>
            <p>
              The goal is to get the majority of colour discs on the board at
              the end of the game.
            </p>

            <h3>Gameplay : </h3>
            <p>The game alternates between white and black until:</p>
            <ol>
              <li>
                One player can not make a valid move to outflank the opponent.{" "}
              </li>
              <li>Both players have no valid moves.</li>
            </ol>
            <p>
              When a player has no valid moves, he pass his turn and the
              opponent continues.
            </p>
            <p>A player can not voluntarily forfeit his turn.</p>
            <p>When both players can not make a valid move the game ends.</p>

            <h3>Legal Move : </h3>
            <p>Black always moves first.</p>
            <p>
              A move is made by placing a disc of the player's color on the
              board in a position that "out-flanks" one or more of the
              opponent's discs.
            </p>
            <p>
              A disc or row of discs is outflanked when it is surrounded at the
              ends by discs of the opposite color.
            </p>
            <p>
              A disc may outflank any number of discs in one or more rows in any
              direction (horizontal, vertical, diagonal).
            </p>
          </div>
        </div>
        <Game />
      </main>
    </>
  );
}

export default App;
