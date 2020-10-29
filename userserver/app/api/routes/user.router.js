const user_controller = require('../crud/user.crud')

const express = require('express')
const router = express.Router()

const User = require('../../model/user')
const Name = require('../../model/name')
const Email = require('../../model/email')
const PhoneNumber = require('../../model/phonenumber')

//router.get('/', user.findAll)

router.post('/', async (req, res, next) => {
  try {
    let name = new Name(req.body.firstname, req.body.lastname);
    let email = new Email(req.body.email);
    let phonenumber = new PhoneNumber(req.body.country, req.body.phonenumber);
    let user = new User(name, email, phonenumber, req.body.birthdate);

    let id = await user_controller.create(user)

    res.status(201)
    res.json({ success: true, id });
  } catch (error) {
    res.status(500)
    res.json({ success: false, error: error.message })
  }
})

//router.get('/:id', user.findOne)

//router.delete('/:id', user.remove)

module.exports = router