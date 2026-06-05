export default function RoomSpecs({ room }) {
  return (
    <div className="room-detail__specs">
      <div className="room-detail__spec-item">
        <div className="room-detail__spec-icon">
          <svg
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
        </div>
        <div className="room-detail__spec-info">
          <span className="room-detail__spec-label">Kapasitas</span>
          <span className="room-detail__spec-value">{room.capacity} orang</span>
        </div>
      </div>
      <div className="room-detail__spec-item">
        <div className="room-detail__spec-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="room-detail__spec-info">
          <span className="room-detail__spec-label">Min. Durasi</span>
          <span className="room-detail__spec-value">{room.minHours} jam</span>
        </div>
      </div>
      <div className="room-detail__spec-item">
        <div className="room-detail__spec-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="room-detail__spec-info">
          <span className="room-detail__spec-label">Operasional</span>
          <span className="room-detail__spec-value">
            {room.operationalHours.open}–{room.operationalHours.close}
          </span>
        </div>
      </div>
    </div>
  );
}
