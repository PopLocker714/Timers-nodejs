exports.up = function (knex) {
  return knex.schema.createTable("sessions", (table) => {
    table.string("id");
    table.string("user_id").notNullable();
    // table.foreign("user_id").references("users.id");
    table.string("session_id").notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("sessions");
};
