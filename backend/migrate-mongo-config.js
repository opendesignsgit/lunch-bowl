const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lunchbowl';

const config = {
  mongodb: {
    url: mongoUri,  // Use the Mongo URI from the config
    databaseName: 'lunchbowl',  // Specify your database name
    options: {

    },
  },
  migrationsDir: 'database/migrations',  // Folder where migration files are located
  changelogCollectionName: 'changelog',  // Keeps track of which migrations have been applied
  seedersDir: 'database/seeders',

  migrationFileExtension: '.js',  // Use JavaScript for migrations

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determine
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false,

  // Don't change this, unless you know what you're doing
  moduleSystem: 'commonjs',
};

module.exports = config;