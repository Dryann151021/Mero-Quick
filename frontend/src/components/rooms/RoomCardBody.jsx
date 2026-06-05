export default function RoomCardBody({ room }) {
  return (
    <div className="room-card__body">
      <h3 className="room-card__name">{room.name}</h3>
      <div className="room-card__meta">
        <div className="room-card__meta-item">
          <svg
            className="room-card__meta-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Kapasitas {room.capacity} orang
        </div>
        <div className="room-card__meta-item">
          <svg
            className="room-card__meta-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Min. {room.minHours} jam
        </div>
      </div>
      <div className="room-card__location">
        <svg
          className="room-card__location-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {room.address}
      </div>
    </div>
  );
}
