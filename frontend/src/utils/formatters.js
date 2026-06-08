export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
export function formatDate(date) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
export function formatDateShort(date) {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}
export function formatInputDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
export function calcDuration(start, end) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(0, (eh * 60 + em - (sh * 60 + sm)) / 60);
}

export function calcBookingDuration(startDate, startTime, endDate, endTime) {
  const startDateTime = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);
  return Math.max(
    0,
    (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60),
  );
}
export function formatBookingDateTimeRange(
  startDate,
  startTime,
  endDate,
  endTime,
) {
  if (!startDate || !startTime || !endDate || !endTime) {
    return '';
  }

  if (startDate === endDate) {
    return `${formatDateShort(new Date(startDate))} • ${startTime} - ${endTime}`;
  }

  return `${formatDateShort(new Date(startDate))} ${startTime} - ${formatDateShort(new Date(endDate))} ${endTime}`;
}
export function generateTimeOptions(open, close) {
  const [oh] = open.split(':').map(Number);
  const [ch] = close.split(':').map(Number);
  const times = [];
  for (let h = oh; h <= ch; h++) {
    times.push(`${String(h).padStart(2, '0')}:00`);
    if (h < ch) times.push(`${String(h).padStart(2, '0')}:30`);
  }
  return times;
}

export const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
