import { formatDateShort } from "../../utils/formatters";

export default function BookingScheduleInfo({ bookings, selectedDate }) {
  return (
    <div className="booking-schedule__info">
      <span className="booking-schedule__count">
        {bookings.length} pemesanan
      </span>
      <span className="booking-schedule__date-text">
        {formatDateShort(new Date(selectedDate))}
      </span>
    </div>
  );
}
