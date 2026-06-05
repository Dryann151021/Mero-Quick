export const up = (pgm) => {
  pgm.addColumn('users', {
    role: {
      type: 'VARCHAR(20)',
      notNull: true,
      default: 'user',
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumn('users', 'role');
};
