const GuestReview = require('../../model/hostReview')

exports.createReview = (req, res) => {
  review_params = {...req.params, ...req.body}
  GuestReview.create(review_params).then((newReview) => {
    res.status(201).json(newReview);
  })
}

exports.getAllReviews = (req, res) => {
  GuestReview.findAll({where: {userId: req.params.userId}}).then((reviews) => {
    res.status(200).json(reviews)
  })
}

exports.getReview = (req, res) => {
  // here should be some check that the review 
  // belongs to the specified userId
  GuestReview.findByPk(req.params.reviewId).then((review) => {
    res.status(200).json(review);
  })
}