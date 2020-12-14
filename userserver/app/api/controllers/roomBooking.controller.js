const UserController = require('./user.controller');
const RoomBooking = require('../../model/roomBooking');
const aux = require('../filterObjectKeys');
require('dotenv').config();

const roomBookingKeys = ['booking_id', 'room_id'];

async function bookingExists(id) {
  let booking = await RoomBooking.findOne({ where: { 'booking_id': id } });
  return booking != null;
}

exports.createBooking = async (req, res) => {

  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(401).json({ error: "unauthorized" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  
  const toCreate = aux.filterObjectKeys(req.body, roomBookingKeys);
  bookingParams = {...req.params, ...toCreate};

  RoomBooking.create(bookingParams).then((newBooking) => {
    res.status(201).json(aux.filterObjectKeys(newBooking.toJSON(), [...roomBookingKeys, "userId"]));
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.getAllBookings = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(401).json({ error: "unauthorized" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }

  RoomBooking.findAll({ where: { userId: req.params.userId }, attributes: [...roomBookingKeys, "userId"] }).then((bookings) => {
    res.status(200).json({ userId: req.params.userId, amount: bookings.length, bookings: bookings });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.getBooking = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(401).json({ error: "unauthorized" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await bookingExists(req.params.roomBookingId))) {
    res.status(404).json({ error: "booking not found" });
    return;
  }

  RoomBooking.findOne({ where:{ booking_id:[req.params.roomBookingId], userId: [req.params.userId] },
                                attributes: [...roomBookingKeys, "userId"]
                              }).then((booking) => {
    if (booking != null)
      res.status(200).json(booking)
    else
      res.status(404).json({ error: "no relation between user and room booking" });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.deleteBooking = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(401).json({ error: "unauthorized" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await bookingExists(req.params.roomBookingId))) {
    res.status(404).json({ error: "booking not found" });
    return;
  }

  RoomBooking.destroy({ where: { booking_id: req.params.roomBookingId, userId: req.params.userId } })
    .then((result) => {
      if (result)
        res.status(200).json(result);
      else
        res.status(404).json({ error: "no relation between user and room booking" })
    }).catch((error) => {
      res.status(500).json({ error: error.message });
    })
}
