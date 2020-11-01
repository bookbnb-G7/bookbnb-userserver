const Rating = require('../../model/hostRating')

exports.createRating = (req, res) => {
  rating_params = {...req.params, ...req.body}
  Rating.create(rating_params).then((newRating) => {
    res.status(201).json(newRating);
  })
}

exports.getAllRatings = (req, res) => {
  Rating.findAll({where: {userId: req.params.userId}}).then((ratings) => {
    res.status(200).json(ratings)
  })
}

exports.getRating = (req, res) => {
  // here should be some check that the rating 
  // belongs to the specified userId
  Rating.findByPk(req.params.ratingId).then((rating) => {
    res.status(200).json(rating)
  })
}