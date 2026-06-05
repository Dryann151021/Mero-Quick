import { weekDays } from "../../utils/formatters";

export default function BookingScheduleCalenderGrid({ calendar, formatISO, selectedDate, onDateChange }) {
  return (
    <div className="booking-schedule__calendar-grid">
      {weekDays.map((day) => (
        <div key={day} className="booking-schedule__weekday">
          {day}
        </div>
      ))}
      {calendar.map((week, weekIndex) =>
        week.map(({ date, inMonth }) => {
          const iso = formatISO(date);
          const isSelected = iso === selectedDate;
          return (
            <button
              key={`${weekIndex}-${iso}`}
              type="button"
              className={`booking-schedule__day${inMonth ? "" : " booking-schedule__day--faded"}${isSelected ? " booking-schedule__day--selected" : ""}`}
              onClick={() => inMonth && onDateChange(iso)}
              disabled={!inMonth}
            >
              <span>{date.getDate()}</span>
            </button>
          );
        }),
      )}
    </div>
  );
}
