
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', function(table){
      table.increments('id').primary();
      table.string('projectName');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('palette', function(table) {
      table.increments('id').primary();
      table.string('projectName');
      table.string('paletteName');
      table.string('color1');
      table.string('color2');
      table.string('color3');
      table.string('color4');
      table.string('color5');
      table.integer('projects_id').unsigned()
      table.foreign('projects_id')
        .references('projects.id');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('palette'),
    knex.schema.dropTable('projects')
  ]);
};
