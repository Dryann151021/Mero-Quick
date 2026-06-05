export default function RoomHeader({ room }) {
    return (
        <div className="room-detail__header">
            <h1 className="room-detail__title">{room.name}</h1>
            <div className="room-detail__meta">
                <span
                    className={`room-detail__badge room-detail__badge--${room.type}`}
                >
                    {room.type === 'meeting' ? 'Meeting Room' : 'Event Space'}
                </span>
                <div className="room-detail__rating-wrap">
                    <span className="room-detail__star">★</span>
                    <span className="room-detail__rating-val">{room.rating}</span>
                    <span className="room-detail__review-count">
                        · {room.reviewCount} ulasan
                    </span>
                </div>
                <div className="room-detail__location">
                    <svg
                        className="room-detail__location-icon"
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
        </div>
    );
}
