import "../style/main.scss";

import Game from "./components/Game";

function App() {
  return (
    <>
      <h1>Othello</h1>
      <Game />
      <div className="rules">
        <br />
        <h2>Here I can write the rules</h2>
        <br />
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus
          corrupti ad id tempora deserunt officia odit nihil voluptatibus quod
          <br />
          quaerat, excepturi veritatis esse modi iusto, ipsa illo velit. Ipsam
          <br />
          architecto totam reprehenderit fugit veritatis. Laborum totam unde
          culpa esse voluptates.
        </p>
      </div>
    </>
  );
}

export default App;
