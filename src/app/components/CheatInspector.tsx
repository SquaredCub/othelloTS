import React from "react";
import { WhitePawn, BlackPawn } from "./Pawns";
type Props = {
  selectedState: number;
  handleClick: (e: MouseEvent) => void;
  previousState: number[][][];
  prevRef: React.LegacyRef<HTMLSpanElement>;
  nextRef: React.LegacyRef<HTMLSpanElement>;
};
export function CheatInspector({
  selectedState,
  handleClick,
  prevRef,
  nextRef,
  previousState,
}: Props) {
  return (
    <div className="cheatInspector">
      <h2>Cheat Inspector</h2>
      {/* CHEAT INSPECTOR CONTROLS */}
      <div className="prevSelector">
        <div className="prevSelector__info">
          Turn n°{selectedState}/
          {previousState.length - 1 < 0 ? 0 : previousState.length - 1}
        </div>
        <div className="prevSelector__controls">
          <span //@ts-ignore
            onClick={handleClick}
            style={{
              cursor: "pointer",
            }}
            id={"leftBtn"}
            ref={prevRef}
          >
            {"<"}
          </span>
          <span //@ts-ignore
            onClick={handleClick}
            style={{
              cursor: "pointer",
            }}
            id={"rightBtn"}
            ref={nextRef}
          >
            {">"}
          </span>
        </div>
      </div>
      {/* CHEAT INSPECTOR */}
      <div className="prev">
        {previousState.length > 0 &&
          previousState[selectedState].map(
            (line: number[], lineIndex: number) =>
              line.map((cell: number, cellIndex: number) => {
                const pos = [lineIndex, cellIndex];
                return (
                  <div
                    key={"d" + pos.toString()}
                    className={"cell"}
                    id={pos.toString()}
                  >
                    {cell ? cell === 1 ? <WhitePawn /> : <BlackPawn /> : null}
                    {/* DEVELOPER HELP */}
                    {/* <span
            className="tooltip"
            style={{ color: "black" }}
            >{`${lineIndex},${cellIndex}`}</span> */}
                  </div>
                );
              })
          )}
      </div>
    </div>
  );
}
