const HostReview = require('../../model/hostReview')
const aux = require('../filterObjectKeys');

const reviewKeys = ['review', 'reviewer', 'reviewer_id'];

exports.createReview = (req, res) => {
  const toCreate = aux.filterObjectKeys(req.body, reviewKeys);
  review_params = {...req.params, ...toCreate};

  HostReview.create(review_params).then((newReview) => {
    res.status(201).json(aux.filterObjectKeys(newReview.toJSON(), [...reviewKeys, "id"]));
  }).catch((error) => {
    res.status(500).json({ success: "false", error: error.message });
  })
}

exports.getAllReviews = (req, res) => {
  HostReview.findAll({ where: {userId: [req.params.userId]}, attributes: [...reviewKeys, "id"] }).then((reviews) => {
    res.status(200).json(reviews);
  }).catch((error) => {
    res.status(500).json({ success: "false", error: error.message });
  })
}

exports.getReview = (req, res) => {
  HostReview.findOne({ where:{ id: req.params.reviewId, userId: req.params.userId }, attributes: reviewKeys }).then((review) => {
    if (review != null)
      res.status(200).json(review);
    else
      res.status(404).json({ success:"false", error:"Not found" });
  }).catch((error) => {
    res.status(500).json({ success: "false", error: error.message });
  })
}

exports.updateReview = (req, res) => {
  const toUpdate = aux.filterObjectKeys(req.body, reviewKeys);
  HostReview.findOne({ where: { id: req.params.reviewId, userId: req.params.userId } }).then((review) => {
    if (review) {
      review.update(toUpdate).then((reviewUpdated) => {
        res.status(200).json(aux.filterObjectKeys(reviewUpdated.toJSON(), [...reviewKeys, "id"]));
      }).catch((error) => {
        res.status(500).json( { success: "false", error});
      });
    } else
      res.status(404).json({ success:"false", error:"Not found" })
  }).catch((error) => {
    res.status(500).json( { success: "false", error: error.message });
  });
}

exports.deleteReview = (req, res) => {
  HostReview.destroy({ where: { id: req.params.reviewId, userId: req.params.userId } })
    .then((result) => {
      if (result)
        res.status(200).json(result);
      else
        res.status(404).json({ success:"false", error:"Not found" })
    }).catch((error) => {
      res.status(500).json({ success: "false", error: error.message });
    });
}
