const HostRating = require('../../model/hostRating')
const aux = require('../filterObjectKeys');

const ratingKeys = ['rating', 'reviewer', 'reviewer_id'];

exports.createRating = (req, res) => {
  const toCreate = aux.filterObjectKeys(req.body, ratingKeys);
  rating_params = {...req.params, ...toCreate};

  HostRating.create(rating_params).then((newRating) => {
    res.status(201).json(aux.filterObjectKeys(newRating.toJSON(), [...ratingKeys, "id"]));
  }).catch((error) => {
    res.status(500).json({ success: "false", error: error.message });
  })
}

exports.getAllRatings = (req, res) => {
  let query = aux.filterObjectKeys(req.query, [...ratingKeys, "id"]);
  query["userId"] = req.params.userId;
  HostRating.findAll({ where: query, attributes: [...ratingKeys, "id"] }).then((ratings) => {
    res.status(200).json({ userId: req.params.userId, amount: ratings.length, ratings: ratings });
  }).catch((error) => {
    res.status(500).json({ success: "false", error: error.message });
  })
}

exports.getRating = (req, res) => {
  HostRating.findOne({ where:{ id:[req.params.ratingId], userId: [req.params.userId] }, attributes: ratingKeys }).then((rating) => {
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
  HostRating.findOne({ where: { id: req.params.ratingId, userId: req.params.userId } }).then((rating) => {
    if (rating) {
      rating.update(toUpdate).then((ratingUpdated) => {
        res.status(200).json(aux.filterObjectKeys(ratingUpdated.toJSON(), [...ratingKeys, "id"]));
      }).catch((error) => {
        res.status(500).json( { success: "false", error: error.message});
      });
    } else
      res.status(404).json({ success:"false", error:"Not found" })
  }).catch((error) => {
    res.status(500).json( { success: "false", error: error.message });
  });
}

exports.deleteRating = (req, res) => {
  HostRating.destroy({ where: { id: req.params.ratingId, userId: req.params.userId } })
    .then((result) => {
      if (result)
        res.status(200).json(result);
      else
        res.status(404).json({ success:"false", error:"Not found" })
    }).catch((error) => {
      res.status(500).json({ success: "false", error: error.message });
    })
}
