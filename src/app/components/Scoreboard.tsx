import React from "react";

const Scoreboard = ({ score }: { score: { white: number; black: number } }) => {
  return (
    <div className="scoreContainer">
      <h2>Score</h2>
      <div>Black : {score.black} pawns</div>
      <div>White : {score.white} pawns</div>
    </div>
  );
};

export default Scoreboard;
