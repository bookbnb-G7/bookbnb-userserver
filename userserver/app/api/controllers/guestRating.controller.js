const GuestRating = require('../../model/guestRating')
const aux = require('../filterObjectKeys');

const ratingKeys = ['rating', 'reviewer', 'reviewer_id'];

exports.createRating = (req, res) => {
  const toCreate = aux.filterObjectKeys(req.body, ratingKeys);
  rating_params = {...req.params, ...toCreate};

  GuestRating.create(rating_params).then((newRating) => {
    res.status(201).json(aux.filterObjectKeys(newRating.toJSON(), [...ratingKeys, "id"]));
  }).catch((error) => {
    res.status(500).json({ success: "false", error: error.message, params: req.params });
  })
}

exports.getAllRatings = (req, res) => {
  GuestRating.findAll({ where: {userId: [req.params.userId]}, attributes: [...ratingKeys, "id"] }).then((ratings) => {
    res.status(200).json(ratings);
  }).catch((error) => {
    res.status(500).json({ success: "false", error: error.message });
  })
}

exports.getRating = (req, res) => {
  GuestRating.findOne({ where:{ id:[req.params.ratingId], userId: [req.params.userId] }, attributes: ratingKeys }).then((rating) => {
    if (rating != null)
      res.status(200).json(rating)
    else
      res.status(404).json({ success:"false", error:"Not found" });
  }).catch((error) => {
    res.status(500).json({ success: "false", error: error.message });
  })
}

exports.updateRating = (req, res) => {
  const toUpdate = aux.filterObjectKeys(req.body, ratingKeys);
  GuestRating.findOne({ where: { id: req.params.ratingId, userId: req.params.userId } }).then((rating) => {
    if (rating) {
      rating.update(toUpdate).then((ratingUpdated) => {
        res.status(200).json(aux.filterObjectKeys(ratingUpdated.toJSON(), [...ratingKeys, "id"]));
      }).catch((error) => {
        res.status(500).json( { success: "false", error});
      });
    } else
      res.status(404).json({ success:"false", error:"Not found" })
  }).catch((error) => {
    res.status(500).json( { success: "false", error: error.message });
  });
}

exports.deleteRating = (req, res) => {
  GuestRating.destroy({ where: { id: req.params.ratingId, userId: req.params.userId } })
    .then((result) => {
      if (result)
        res.status(200).json(result);
      else
        res.status(404).json({ success:"false", error:"Not found" })
    }).catch((error) => {
      res.status(500).json({ success: "false", error: error.message });
    })
}
