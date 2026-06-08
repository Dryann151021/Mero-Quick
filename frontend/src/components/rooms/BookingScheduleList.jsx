import { formatBookingDateTimeRange } from '../../utils/formatters';

export default function BookingScheduleList({ bookings, room }) {
  return (
    <ul className="booking-schedule__list">
      {bookings.map((booking) => (
        <li key={booking.id} className="booking-schedule__item">
          <div className="booking-schedule__item-main">
            <div>
              <div className="booking-schedule__item-room">
                {booking.roomName}
              </div>
              {room ? null : (
                <div className="booking-schedule__item-room-type">
                  {booking.roomType === 'meeting'
                    ? 'Meeting Room'
                    : 'Event Space'}
                </div>
              )}
            </div>
            <div className="booking-schedule__item-time">
              {formatBookingDateTimeRange(
                booking.startDate || booking.date,
                booking.startTime,
                booking.endDate || booking.date,
                booking.endTime,
              )}
            </div>
          </div>
          <div className="booking-schedule__item-meta">
            <span className="booking-schedule__item-note booking-schedule__item-note--bold">
              Kegiatan: {booking.activity}
            </span>
            <span className="booking-schedule__item-note">
              Organisasi: {booking.organization}
            </span>
            <span className="booking-schedule__item-note booking-schedule__item-note--secondary">
              Oleh: {booking.user_email || 'Pengguna'}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
