require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '4033',
    database: process.env.DB_NAME || 'joinnexora',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: 'neondb_owner',
    password: 'npg_ghzCy2IaDcO9',
    database: 'neondb',
    host: 'ep-wispy-pine-a1jf2b5d-pooler.ap-southeast-1.aws.neon.tech',
    port: 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      connectTimeout: 60000
    },
    retry: {
      max: 3
    }
  }
};
