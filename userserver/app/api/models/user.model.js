const Sequelize = require('sequelize')
const database  = require('../../db') 

const User = database.define('user', {
  	email: { type: Sequelize.STRING, allowNull: false },
  	country: { type: Sequelize.STRING, allowNull: false },
  	phonenumber: { type: Sequelize.STRING, allowNull: false },
  	birthdate: { type: Sequelize.DATEONLY, allowNull: false },
  	firstname: { type: Sequelize.STRING, allowNull: false },
  	lastname: { type: Sequelize.STRING, allowNull: false }
})

module.exports = User