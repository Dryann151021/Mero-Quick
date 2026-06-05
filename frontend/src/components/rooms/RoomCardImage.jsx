export default function RoomCardImage({ room }) {
  return (
    <div className="room-card__image-wrap">
      <div
        className="room-card__image-placeholder"
        style={{
          width: "100%",
          height: "200px",
          backgroundColor: "#e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={room.images || "/images/room-placeholder.png"}
          alt={room.name}
          className="room-card__image"
        />
      </div>
      {room.type && (
        <span className={`room-card__badge room-card__badge--${room.type.toLowerCase()}`}>
          {room.type}
        </span>
      )}
    </div>
  );
}
