export default function BookingScheduleHeader({ title, subtitle, room }) {
  return (
    <div className="booking-schedule__header">
      <div>
        <p className="booking-schedule__label">
          {room ? "Jadwal Ruangan" : "Booking Hari Ini"}
        </p>
        <h2 className="booking-schedule__title">{title}</h2>
        <p className="booking-schedule__subtitle">{subtitle}</p>
      </div>
    </div>
  );
}
