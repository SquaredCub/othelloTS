import React, { useState, useRef, useEffect } from "react";
type Props = {
  queue: any;
  dispatch: React.Dispatch<any>;
  setMoveIt: any;
  setLegalMoves: any;
};
const DispatchHandler = ({
  queue,
  dispatch,
  setMoveIt,
  setLegalMoves,
}: Props) => {
  const timer = useRef<number>();
  useEffect(() => {
    const time = new Date().getSeconds();
    if (queue.length === 0) return;
    setLegalMoves([]);
    const timerId = setTimeout(() => {
      console.log(new Date().getSeconds() - time);
      dispatch(queue[0]);
      queue.shift();
    }, 1000);
    timer.current = timerId;
    return () => {
      if (queue.length === 0) {
        setMoveIt(false);
        clearTimeout(timerId);
      }
    };
  });
  return <></>;
};

export default DispatchHandler;
