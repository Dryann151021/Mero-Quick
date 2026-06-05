/* eslint-disable */
export const up = (pgm) => {
  pgm.createTable('rooms', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    location: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    address: {
      type: 'TEXT',
      notNull: true,
    },
    capacity: {
      type: 'INTEGER',
      notNull: true,
    },
    price_per_hour: {
      type: 'INTEGER',
      notNull: true,
    },
    description: {
      type: 'TEXT',
      notNull: true,
    },
    facilities: {
      type: 'JSONB',
      notNull: true,
    },
    min_hours: {
      type: 'INTEGER',
      notNull: true,
    },
    open_time: {
      type: 'VARCHAR(10)',
      notNull: true,
    },
    close_time: {
      type: 'VARCHAR(10)',
      notNull: true,
    },
    type: {
      type: 'VARCHAR(10)',
      notNull: true,
    },
    owner_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('rooms');
};
