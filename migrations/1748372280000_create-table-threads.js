/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    body: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users",
      onDelete: "CASCADE",
    },
    date: {
      type: "TIMESTAMP WITH TIME ZONE",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};
exports.down = (pgm) => {
  pgm.dropTable("threads");
};
