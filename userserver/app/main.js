const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const database = require('./db');
const logger = require('./api/logger');

const port = process.env.PORT || 8080;

const app = express();

const swaggerOptions = { 
  swaggerDefinition: {
    info: { 
      title: "Userserver API",
      description: "Userserver API information",
    },
    servers: ["http://localhost:8080"]
  },
  apis: ["./userserver/app/main.js", "./userserver/app/api/routes/*.js", "./userserver/app/model/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

/**
 * @swagger
 * /ping:
 *  get:
 *    tags:
 *    - Default
 *    produces:
 *    - "application/json"
 *    responses:
 *      "200":
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: userserver
 */
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    logger.info('GET request to endpoint "/ping"\n' +
              '\tResponse status: 200\n' +
              `\tResponse body: {message:'userserver'}`
    );
    res.status(200).json({message:'userserver'});
})

app.use('/users', require('./api/routes/users.router'));
app.use('/users', require('./api/routes/hostReviews.router'));
app.use('/users', require('./api/routes/hostRatings.router'));
app.use('/users', require('./api/routes/guestReviews.router'));
app.use('/users', require('./api/routes/guestRatings.router'));
app.use('/users', require('./api/routes/favoriteRooms.router'));

database.sync().then(() => {
 	app.listen(port, () => {
    logger.info(`Listening on port ${port}`)
  })
});

