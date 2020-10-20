const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()

const database = require('./db')

const port = process.env.PORT || 8080

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.json({message:'userserver'})
})

app.use('/users', require('./api/routes/user.router'))

database.sync().then(() => {
 	app.listen(port, () => {
    	console.log(`Listening on port ${port}`)
  	})
})