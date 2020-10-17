const Sequelize = require('sequelize')
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL

console.log(DATABASE_URL)

const database = new Sequelize(DATABASE_URL ,{
  database: 'users',
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op
})

const User = database.define('user', {
  username: { type: Sequelize.STRING, allowNull: false },
  firstname: { type: Sequelize.STRING, allowNull: false },
  lastname: { type: Sequelize.STRING, allowNull: false }
})

module.exports = { User, database }