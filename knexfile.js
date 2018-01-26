module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/palettepicker',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/palettepicker_test',
    useNullAsDefault: true,
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    }
  }
};
