import RoomCardImage from "./RoomCardImage";
import RoomCardBody from "./RoomCardBody";
import RoomCardFooter from "./RoomCardFooter";

export default function RoomCard({ room, onClick }) {
  return (
    <article className="room-card" onClick={() => onClick(room)}>
      <RoomCardImage room={room} />
      <RoomCardBody room={room} />
      <RoomCardFooter room={room} onClick={onClick} />
    </article>
  );
}
