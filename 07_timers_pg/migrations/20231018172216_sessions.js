exports.up = function (knex) {
  return knex.schema.createTable("sessions", (table) => {
    table.string("user_id").notNullable();
    table.string("session_id").notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("sessions");
};
