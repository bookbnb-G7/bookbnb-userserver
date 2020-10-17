const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()

const { database } = require('./db')

const port = process.env.SERVER_PORT || 8080

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/users', require('./api/routes/user.router'))

database.authenticate().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
})