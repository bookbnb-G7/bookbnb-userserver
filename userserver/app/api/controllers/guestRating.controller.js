const GuestRating = require('../../model/guestRating')

exports.createRating = (req, res) => {
  rating_params = {...req.params, ...req.body}
  GuestRating.create(rating_params).then((newRating) => {
    res.status(201).json(newRating);
  })
}

exports.getAllRatings = (req, res) => {
  GuestRating.findAll({where: {userId: req.params.userId}}).then((ratings) => {
    res.status(200).json(ratings)
  })
}

exports.getRating = (req, res) => {
  // here should be some check that the rating 
  // belongs to the specified userId
  GuestRating.findByPk(req.params.ratingId).then((rating) => {
    res.status(200).json(rating)
  })
}