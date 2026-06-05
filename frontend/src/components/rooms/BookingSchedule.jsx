import { useEffect, useMemo, useState } from "react";
import BookingScheduleHeader from "./BookingScheduleHeader";
import BookingScheduleCalender from "./BookingScheduleCalender";
import BookingScheduleCalenderGrid from "./BookingScheduleCalenderGrid";
import BookingScheduleList from "./BookingScheduleList";
import BookingScheduleInfo from "./BookingScheduleInfo";

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const weeks = [];
  let currentDay = 1 - startWeekday;

  for (let week = 0; week < 6; week++) {
    const days = [];
    for (let day = 0; day < 7; day++, currentDay += 1) {
      const date = new Date(year, month, currentDay);
      days.push({
        date,
        inMonth: date.getMonth() === month,
      });
    }
    weeks.push(days);
  }

  return weeks;
}

function formatISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function bookingIsActive(booking) {
  const endDateTime = new Date(`${booking.date}T${booking.endTime}`);
  return endDateTime >= new Date();
}

export default function BookingSchedule({
  bookings,
  selectedDate,
  onDateChange,
  room,
}) {
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const [year, month] = selectedDate.split("-").map(Number);
    return new Date(year, month - 1, 1);
  });

  useEffect(() => {
    const [year, month] = selectedDate.split("-").map(Number);
    setCalendarMonth(new Date(year, month - 1, 1));
  }, [selectedDate]);

  const calendar = useMemo(
    () => buildCalendar(calendarMonth.getFullYear(), calendarMonth.getMonth()),
    [calendarMonth],
  );

  const title = room ? "Kalender Pemesanan Ruangan" : "Daftar Booking Ruangan";
  const subtitle = room
    ? `Lihat jadwal pemesanan ${room.name} pada tanggal yang dipilih.`
    : "Filter booking berdasarkan tanggal pada kalender untuk melihat ruang yang sudah dipesan.";

  function changeMonth(offset) {
    setCalendarMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  }

  return (
    <section className="booking-schedule">
      <BookingScheduleHeader title={title} subtitle={subtitle} room={room} />
      <BookingScheduleCalender
        calendarMonth={calendarMonth}
        changeMonth={changeMonth}
      />
      <BookingScheduleCalenderGrid
        calendar={calendar}
        formatISO={formatISO}
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />
      <BookingScheduleInfo bookings={bookings} selectedDate={selectedDate} />

      {bookings.length === 0 ? (
        <div className="booking-schedule__empty">
          Tidak ada pemesanan untuk tanggal ini.
        </div>
      ) : (
        <BookingScheduleList bookings={bookings} room={room} />
      )}
    </section>
  );
}
