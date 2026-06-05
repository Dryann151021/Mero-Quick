/* eslint-disable camelcase */
export const up = (pgm) => {
  pgm.createTable('bookings', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    room_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"rooms"',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    booking_date: {
      type: 'DATE',
      notNull: true,
    },
    start_time: {
      type: 'VARCHAR(5)',
      notNull: true,
    },
    end_time: {
      type: 'VARCHAR(5)',
      notNull: true,
    },
    activity: {
      type: 'TEXT',
      notNull: true,
    },
    organization: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    status: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('bookings');
};
