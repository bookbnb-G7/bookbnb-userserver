const User = require('../../model/user')

exports.createUser = (req, res) => {
  user_parms = req.body;
  User.create(user_parms).then((newUser) => {
    res.status(201).json(newUser);
  })
}

exports.getUser = (req, res) => {
  User.findByPk(req.params.userId).then((user) => {
    res.status(200).json(user);
  })
}