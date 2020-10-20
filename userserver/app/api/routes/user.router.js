const user = require('../crud/user.crud')

const express = require('express')
const router = express.Router()

router.get('/', user.findAll)

router.post('/', user.create)

router.get('/:id', user.findOne)

router.delete('/:id', user.remove)

module.exports = router