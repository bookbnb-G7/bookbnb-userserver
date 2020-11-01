const Sequelize = require('sequelize')
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL

console.log(DATABASE_URL)

const database = new Sequelize(DATABASE_URL ,{
  	dialect: 'postgres',
  	operatorsAliases: Sequelize.Op,
    define: {timestamp: false}
})

module.exports = database 