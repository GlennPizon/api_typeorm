const mysql2 = require('mysql2');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config.json');

module.exports = db = {};

// Initialize the database connection


async function initialize() {
    try {
        // Connect to MySQL server and create the API database if it doesn't already exist
        const connection = await mysql2.createConnection({
            host: config.host,
            user: config.username,
            password: config.password
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
        await connection.end();

        // Connect to the API database with Sequelize
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync the models to the database (create/update tables if required)
        await sequelize.sync({ alter: true });
        console.log('Database synchronized.');

        console.log('Initialization complete.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Call the initialize function on startup
initialize();

module.exports = db;



async function initialize(){
    // create the dtabase if not exist

    const {host,port,usr,password,database} = config.database;
    await connection.query(`CREATE DATABASE IF NOT EXIST \`${database}\;`);

    const sequelize = new Sequelize(database, user, password, {dialect : 'mysql' });

    db.User = require('../users/user.model')(sequelize);

    await sequelize.sync({ alter : true});

}