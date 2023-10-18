exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.string("id").notNullable();
      table.string("username", 255).notNullable().unique();
      table.string("password", 255).notNullable().unique();
    })
    .createTable("timers", (table) => {
      table.bigInteger("start").notNullable().defaultTo(Date.now());
      table.bigInteger("end").notNullable().defaultTo(0);
      table.integer("duration").notNullable().defaultTo(0);
      table.integer("progress").notNullable().defaultTo(0);
      table.string("description").notNullable();
      table.boolean("isActive").notNullable().defaultTo(true);
      table.string("id").notNullable();
      table.string("owner_id").notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users").dropTable("timers");
};
