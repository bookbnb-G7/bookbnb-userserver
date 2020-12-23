const UserController = require('./user.controller');
const RoomBooking = require('../../model/roomBooking');
const aux = require('../filterObjectKeys');
const utils = require('../reqResUtils');
require('dotenv').config();
const logger = require('../logger');

const roomBookingKeys = ['booking_id', 'room_id'];

async function bookingExists(id) {
  let booking = await RoomBooking.findOne({ where: { 'booking_id': id } });
  return booking != null;
}

exports.createBooking = async (req, res) => {

  logger.info(`POST request to endpoint "/users/${req.params.userId}/bookings"` +
    `\tRequest body: ${JSON.stringify(req.body)}`
  );

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }
  
  const toCreate = aux.filterObjectKeys(req.body, roomBookingKeys);
  bookingParams = {...req.params, ...toCreate};

  RoomBooking.create(bookingParams).then((newBooking) => {
    logger.info('Room booking created');
    utils.respond(res, 201, aux.filterObjectKeys(newBooking.toJSON(), [...roomBookingKeys, "userId"]));
  }).catch((error) => {
    logger.info('Room booking could not be created');
    utils.respond(res, 500, { error: error.message });
  })
}

exports.getAllBookings = async (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}/bookings"` +
    `\tRequest query: ${JSON.stringify(req.query)}`
  );

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }

  RoomBooking.findAll({ where: { userId: req.params.userId }, attributes: [...roomBookingKeys, "userId"] }).then((bookings) => {
    utils.respond(res, 200, { userId: req.params.userId, amount: bookings.length, bookings: bookings });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  })
}

exports.getBooking = async (req, res) => {

  logger.info(`GET request to endpoint "/users/${req.params.userId}/bookings/${req.params.roomBookingId}"`);

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }
  if (!(await bookingExists(req.params.roomBookingId))) {
    utils.respond(res, 404, { error: "booking not found" });
    return;
  }

  RoomBooking.findOne({ where:{ booking_id:[req.params.roomBookingId], userId: [req.params.userId] },
                                attributes: [...roomBookingKeys, "userId"]
                              }).then((booking) => {
    if (booking != null)
      utils.respond(res, 200, booking);
    else
      utils.respond(res, 404, { error: "no relation between user and room booking" });
  }).catch((error) => {
    utils.respond(res, 500, { error: error.message });
  })
}

exports.deleteBooking = async (req, res) => {

  logger.info(`DELETE request to endpoint "/users/${req.params.userId}/bookings/${req.params.roomBookingId}"`);

  if (utils.apiKeyIsNotValid(req.headers['api-key'], res))
    return;

  if (!(await UserController.userExists(req.params.userId))) {
    utils.respond(res, 404, { error: "user not found" });
    return;
  }
  if (!(await bookingExists(req.params.roomBookingId))) {
    utils.respond(res, 404, { error: "booking not found" });
    return;
  }

  RoomBooking.destroy({ where: { booking_id: req.params.roomBookingId, userId: req.params.userId } })
    .then((result) => {
      if (result){
        logger.info('Room booking deleted');
        utils.respond(res, 200, result);
      } else
        utils.respond(res, 404, { error: "no relation between user and room booking" });
    }).catch((error) => {
      utils.respond(res, 500, { error: error.message });
    })
}
