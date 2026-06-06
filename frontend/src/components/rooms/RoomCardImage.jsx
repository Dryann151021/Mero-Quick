export default function RoomCardImage({ room }) {
  return (
    <div className="room-card__image-wrap">
      <img
        src={room.images || "/images/room-placeholder.png"}
        alt={room.name}
        className="room-card__image"
      />
      {room.type && (
        <span className={`room-card__badge room-card__badge--${room.type.toLowerCase()}`}>
          {room.type}
        </span>
      )}
    </div>
  );
}
