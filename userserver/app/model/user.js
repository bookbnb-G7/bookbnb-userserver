const database = require('../db')
const Sequelize = require('sequelize')

/**
 * @swagger
 * definitions:
 *  UserPayload:
 *    type: object
 *    properties:
 *      id:
 *        type: integer
 *        required: true
 *        example: 1
 *      firstname:
 *        type: string
 *        required: true
 *        example: Elmer
 *      lastname:
 *        type: string
 *        required: true
 *        example: Figueroa Arce
 *      email:
 *        type: string
 *        required: true
 *        format: email
 *        unique: true
 *        description: "Email of the user"
 *        example: chayanne@email.com
 *      country:
 *        type: string
 *        required: true
 *        example: Puerto Rico
 *      phonenumber:
 *        type: string
 *        required: true
 *        example: 1 787 111 1111
 *      birthdate:
 *        type: string
 *        format: date
 *        required: true
 *        example: "1968-06-28"
 *      photo:
 *        type: string
 *        format: url
 *        required: false
 *        example: "https://www.cmtv.com.ar/imagenes_artistas/70.jpg?Chayanne"
 *  User:
 *    allOf:
 *      - $ref: "#/definitions/UserPayload"
 *      - type: object
 *        properties:
 *          createdAt:
 *            type: string
 *            format: datetime
 *            example: "2020-11-10T22:51:03.539Z"
 *          updatedAt:
 *            type: string
 *            format: datetime
 *            example: "2020-11-10T22:51:03.539Z"
 *    
 */

const User = database.define('users', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement:false },
  firstname: { type: Sequelize.STRING(30), allowNull: false },
  lastname: { type: Sequelize.STRING(30), allowNull: false },
  email: { type: Sequelize.STRING(50), 
           unique: { name: 'users_email', msg: 'A user with this email already exists.'}, 
           allowNull: false, 
           validate: { notEmpty: true, isEmail: true } },
  country: { type: Sequelize.STRING(20), allowNull: false },
  phonenumber: { type: Sequelize.STRING(20), allowNull: false },
  birthdate: { type: Sequelize.DATEONLY, allowNull: false },
  photo: { type: Sequelize.STRING(256), allowNull: true }
})

module.exports = User;
