const UserController = require('./user.controller');
const GuestRating = require('../../model/guestRating')
const aux = require('../filterObjectKeys');
require('dotenv').config();

const ratingKeys = ['rating', 'reviewer', 'reviewer_id'];

async function ratingExists(id) {
  let review = await GuestRating.findOne({ where: { id } });
  return review != null;
}

exports.createRating = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(403).json({ error: "forbidden" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  
  const toCreate = aux.filterObjectKeys(req.body, ratingKeys);
  rating_params = {...req.params, ...toCreate};

  GuestRating.create(rating_params).then((newRating) => {
    res.status(201).json(aux.filterObjectKeys(newRating.toJSON(), [...ratingKeys, "id"]));
  }).catch((error) => {
    res.status(500).json({ error: error.message, params: req.params });
  })
}

exports.getAllRatings = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(403).json({ error: "forbidden" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }

  let query = aux.filterObjectKeys(req.query, [...ratingKeys, "id"]);
  query["userId"] = req.params.userId;
  GuestRating.findAll({ where: query, attributes: [...ratingKeys, "id"] }).then((ratings) => {
    res.status(200).json({ userId: req.params.userId, amount: ratings.length, ratings: ratings });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.getRating = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(403).json({ error: "forbidden" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await ratingExists(req.params.ratingId))) {
    res.status(404).json({ error: "rating not found" });
    return;
  }

  GuestRating.findOne({ where:{ id:[req.params.ratingId], userId: [req.params.userId] }, attributes: ratingKeys }).then((rating) => {
    if (rating != null)
      res.status(200).json(rating)
    else
      res.status(404).json({ error: "no relation between user and guest rating" });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.updateRating = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(403).json({ error: "forbidden" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await ratingExists(req.params.ratingId))) {
    res.status(404).json({ error: "rating not found" });
    return;
  }

  const toUpdate = aux.filterObjectKeys(req.body, ratingKeys);
  GuestRating.findOne({ where: { id: req.params.ratingId, userId: req.params.userId } }).then((rating) => {
    if (rating) {
      rating.update(toUpdate).then((ratingUpdated) => {
        res.status(200).json(aux.filterObjectKeys(ratingUpdated.toJSON(), [...ratingKeys, "id"]));
      }).catch((error) => {
        res.status(500).json( { error: error.message});
      });
    } else
      res.status(404).json({ error: "no relation between user and guest rating" })
  }).catch((error) => {
    res.status(500).json( { error: error.message });
  });
}

exports.deleteRating = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(403).json({ error: "forbidden" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await ratingExists(req.params.ratingId))) {
    res.status(404).json({ error: "rating not found" });
    return;
  }

  GuestRating.destroy({ where: { id: req.params.ratingId, userId: req.params.userId } })
    .then((result) => {
      if (result)
        res.status(200).json(result);
      else
        res.status(404).json({ error: "no relation between user and guest rating" })
    }).catch((error) => {
      res.status(500).json({ error: error.message });
    })
}
