const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();

const database = require('./db');

const port = process.env.PORT || 8080;

const app = express();

const swaggerOptions = { 
  swaggerDefinition: {
    info: { 
      title: "Userserver API",
      descrption: "Userserver API information",
    }
  },
  apis: ['./api/routes/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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