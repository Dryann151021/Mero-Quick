import { formatCurrency } from "../../utils/formatters";

export default function RoomCardFooter({ room, onClick }) {
  return (
    <div className="room-card__footer">
      <div className="room-card__price">
        <span className="room-card__price-amount">
          {formatCurrency(room.pricePerHour)}
        </span>
        <span className="room-card__price-unit">/ jam</span>
      </div>
      <button
        className="room-card__book-btn"
        onClick={(e) => {
          e.stopPropagation();
          onClick(room);
        }}
      >
        Pesan
      </button>
    </div>
  );
}
