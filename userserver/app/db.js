const Sequelize = require('sequelize')
require('dotenv').config()


const DATABASE_URL = process.env.DATABASE_URL

console.log(DATABASE_URL)

const database = new Sequelize(DATABASE_URL ,{
  database: 'users',
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op
})

module.exports = database 
