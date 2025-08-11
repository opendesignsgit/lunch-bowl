exports.up = function(knex) {
  return knex.schema.createTable('fcm_tokens', table => {
    table.increments('id').primary();
    table.string('token').notNullable();
    table.string('device').nullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('fcm_tokens');
};
