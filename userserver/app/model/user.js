const database = require('../db')
const Sequelize = require('sequelize')

const User = database.define('users', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:true },
  firstname: { type: Sequelize.STRING(30), allowNull: false },
  lastname: { type: Sequelize.STRING(30), allowNull: false },
  email: { type: Sequelize.STRING(50), allowNull: false },
  country: { type: Sequelize.STRING(20), allowNull: false },
  phonenumber: { type: Sequelize.STRING(20), allowNull: false },
  birthdate: { type: Sequelize.DATEONLY, allowNull: false }
})

module.exports = User;

/*
  email: { type: Sequelize.STRING(50), 
           unique: { name: 'users_email', msg: 'A user with this email already exists.'}, 
           allowNull: false, 
           validate: { notEmpty: true, isEmail: true,}
          },
*/