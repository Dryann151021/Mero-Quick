export const up = (pgm) => {
  pgm.addColumn('users', {
    role: { type: 'VARCHAR(20)', notNull: true, default: 'user' },
  });
  pgm.alterColumn('bookings', 'status', {
    default: 'pending',
  });
};

export const down = (pgm) => {
  pgm.dropColumn('users', 'role');
  pgm.alterColumn('bookings', 'status', {
    default: 'confirmed',
  });
};
