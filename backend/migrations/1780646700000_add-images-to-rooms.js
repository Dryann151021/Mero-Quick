export const up = (pgm) => {
  pgm.addColumn('rooms', {
    images: {
      type: 'TEXT',
      notNull: false,
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumn('rooms', 'images');
};
