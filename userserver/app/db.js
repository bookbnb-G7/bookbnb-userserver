const Sequelize = require('sequelize');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;
const ENVIRONMENT = process.env.ENVIRONMENT;

console.log(DATABASE_URL)

let database = null;

if (ENVIRONMENT == 'production') {
	database = new Sequelize(DATABASE_URL ,{
		dialect: 'postgres',
		operatorsAliases: Sequelize.Op,
	  	define: {timestamp: false}
  	})
} else {
	database = new Sequelize(DATABASE_URL ,{
		dialect: 'sqlite',
		operatorsAliases: Sequelize.Op,
	  	define: {timestamp: false},
		storage: './database.sqlite3'
  	})
}


module.exports = database 