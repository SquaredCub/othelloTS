type Props = {
  whosTurn: string;
};
const TurnInfo = ({ whosTurn }: Props) => {
  return (
    <div className="gameInfo">
      <p>{whosTurn}'s turn</p>
    </div>
  );
};
export default TurnInfo;
