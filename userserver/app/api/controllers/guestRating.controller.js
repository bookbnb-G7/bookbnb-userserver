const GuestRating = require('../../model/guestRating')

exports.createRating = (req, res) => {
  rating_params = {...req.params, ...req.body}
  GuestRating.create(rating_params).then((newRating) => {
    res.status(201).json(newRating);
  }).catch((error) => {
    res.status(500).json({ success: "false", error: [error.message] });
  })
}

exports.getAllRatings = (req, res) => {
  GuestRating.findAll({where: {userId: [req.params.userId]}}).then((ratings) => {
    if (ratings && ratings.length > 0)
      res.status(200).json(ratings)
    else
      res.status(404).json({ success:"false", error:"Not found" });
  }).catch((error) => {
    res.status(500).json({ success: "false", error: [error.message] });
  })
}

exports.getRating = (req, res) => {
  // here should be some check that the rating 
  // belongs to the specified userId
  GuestRating.findOne({ where:{ id:[req.params.ratingId], userId: [req.params.userId] } }).then((rating) => {
    if (rating != null)
      res.status(200).json(rating)
    else
      res.status(404).json({ success:"false", error:"Not found" });
  }).catch((error) => {
    res.status(500).json({ success: "false", error: [error.message] });
  })
}