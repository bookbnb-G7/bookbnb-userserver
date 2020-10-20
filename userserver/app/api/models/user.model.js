const Sequelize = require('sequelize')
const database  = require('../../db') 

const User = database.define('user', {
 	username: { type: Sequelize.STRING, allowNull: false },
  	firstname: { type: Sequelize.STRING, allowNull: false },
  	lastname: { type: Sequelize.STRING, allowNull: false }
})

module.exports = User