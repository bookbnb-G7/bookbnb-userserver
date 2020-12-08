const UserController = require('./user.controller');
const HostReview = require('../../model/hostReview');
const aux = require('../filterObjectKeys');
require('dotenv').config();

const reviewKeys = ['review', 'reviewer', 'reviewer_id'];

async function reviewExists(id) {
  let review = await HostReview.findOne({ where: { id } });
  return review != null;
}

exports.createReview = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(403).json({ error: "forbidden" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  
  const toCreate = aux.filterObjectKeys(req.body, reviewKeys);
  review_params = {...req.params, ...toCreate};
  HostReview.create(review_params).then((newReview) => {
    res.status(201).json(aux.filterObjectKeys(newReview.toJSON(), [...reviewKeys, "id"]));
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.getAllReviews = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(403).json({ error: "forbidden" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }

  let query = aux.filterObjectKeys(req.query, [...reviewKeys, "id"]);
  query["userId"] = req.params.userId;
  HostReview.findAll({ where: query, attributes: [...reviewKeys, "id"] }).then((reviews) => {
    res.status(200).json({ userId: req.params.userId, amount: reviews.length, reviews: reviews });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.getReview = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(403).json({ error: "forbidden" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await reviewExists(req.params.reviewId))) {
    res.status(404).json({ error: "review not found" });
    return;
  }

  HostReview.findOne({ where:{ id: req.params.reviewId, userId: req.params.userId }, attributes: reviewKeys }).then((review) => {
    if (review != null)
      res.status(200).json(review);
    else
      res.status(404).json({ error: "no relation between user and host review" });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.updateReview = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(403).json({ error: "forbidden" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await reviewExists(req.params.reviewId))) {
    res.status(404).json({ error: "review not found" });
    return;
  }

  const toUpdate = aux.filterObjectKeys(req.body, reviewKeys);
  HostReview.findOne({ where: { id: req.params.reviewId, userId: req.params.userId } }).then((review) => {
    if (review) {
      review.update(toUpdate).then((reviewUpdated) => {
      res.status(200).json(aux.filterObjectKeys(reviewUpdated.toJSON(), [...reviewKeys, "id"]));
      }).catch((error) => {
        res.status(500).json( { error: error.message});
      });
    } else
      res.status(404).json({ error: "no relation between user and host review" })
  }).catch((error) => {
    res.status(500).json( { error: error.message });
  });
}

exports.deleteReview = async (req, res) => {
  if (!req.headers.api_key || req.headers.api_key != process.env.API_KEY) {
    res.status(403).json({ error: "forbidden" })
    return
  }
  if (!(await UserController.userExists(req.params.userId))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  if (!(await reviewExists(req.params.reviewId))) {
    res.status(404).json({ error: "review not found" });
    return;
  }

  HostReview.destroy({ where: { id: req.params.reviewId, userId: req.params.userId } }).then((result) => {
    if (result)
      res.status(200).json(result);
    else
      res.status(404).json({ error: "no relation between user and host review" })
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
}
