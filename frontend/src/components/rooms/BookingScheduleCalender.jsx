export default function BookingScheduleCalender({
  calendarMonth,
  changeMonth,
}) {
  return (
    <div className="booking-schedule__calendar-header">
      <button
        type="button"
        className="booking-schedule__calendar-nav"
        onClick={() => changeMonth(-1)}
      ></button>
      <div className="booking-schedule__calendar-title">
        {calendarMonth.toLocaleString("id-ID", {
          month: "long",
          year: "numeric",
        })}
      </div>
      <button
        type="button"
        className="booking-schedule__calendar-nav"
        onClick={() => changeMonth(1)}
      ></button>
    </div>
  );
}
