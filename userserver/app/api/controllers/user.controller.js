const User = require('../../model/user')

exports.createUser = (req, res) => {
  user_parms = req.body;
  User.create(user_parms).then((newUser) => {
    res.status(201).json(newUser);
  }).catch((error) => {
    res.status(500).json({ success: "false", error: [error.message] });
  })
}

exports.getUser = (req, res) => {
  User.findByPk(req.params.userId).then((user) => {
    if (user != null)
      res.status(200).json(user);
    else
      res.status(404).json({ success:"false", error:"Not found" })
  }).catch((error) => {
    res.status(500).json({ success: "false", error: [error.message] });
  })
}