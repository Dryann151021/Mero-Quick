/* eslint-disable */
export const up = (pgm) => {
  pgm.addColumns('bookings', {
    start_date: { type: 'DATE' },
    end_date: { type: 'DATE' },
  });

  pgm.sql(
    'UPDATE bookings SET start_date = booking_date, end_date = booking_date WHERE booking_date IS NOT NULL;'
  );

  pgm.alterColumn('bookings', 'start_date', { notNull: true });
  pgm.alterColumn('bookings', 'end_date', { notNull: true });
};

export const down = (pgm) => {
  pgm.dropColumns('bookings', ['start_date', 'end_date']);
};
