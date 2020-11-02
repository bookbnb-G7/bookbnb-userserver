const HostReview = require('../../model/hostReview')

exports.createReview = (req, res) => {
  review_params = {...req.params, ...req.body}
  HostReview.create(review_params).then((newReview) => {
    res.status(201).json(newReview);
  }).catch((error) => {
    res.status(500).json({ success: "false", error: [error.message] });
  })
}

exports.getAllReviews = (req, res) => {
  HostReview.findAll({where: {userId: [req.params.userId]}}).then((reviews) => {
    if (reviews.length > 0)
      res.status(200).json(reviews);
    else
      res.status(404).json({ success:"false", error:"Not found"});
  }).catch((error) => {
    res.status(500).json({ success: "false", error: [error.message] });
  })
}

exports.getReview = (req, res) => {
  // here should be some check that the review 
  // belongs to the specified userId
  HostReview.findOne({ where:{ id:[req.params.reviewId], userId: [req.params.userId] } }).then((review) => {
    if (review != null)
      res.status(200).json(review);
    else
      res.status(404).json({ success:"false", error:"Not found" });
  }).catch((error) => {
    res.status(500).json({ success: "false", error: [error.message] });
  })
}