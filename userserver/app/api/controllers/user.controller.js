const User = require('../../model/user');
const aux = require('../filterObjectKeys');

const userKeys = ['firstname', 'lastname', 'email', 'country', 'phonenumber', 'birthdate'];

exports.createUser = (req, res) => {
  const toCreate = aux.filterObjectKeys(req.body, userKeys);
  User.create(toCreate).then((newUser) => {
    //newUser contains all the attributes of the table, we want to send the client
    //only the ones in the userKeys list and the 'id'.
    //also newUser needs to be converted to JSON to be able to be filtered.
    res.status(201).json(aux.filterObjectKeys(newUser.toJSON(), [...userKeys, "id"]));
  }).catch((error) => {
    res.status(500).json({ success: "false", error: [error.message] });
  })
}

exports.getUser = (req, res) => {
  User.findOne({ where: { id: req.params.userId }, attributes: userKeys }).then((user) => {
    if (user)
      res.status(200).json(user);
    else
      res.status(404).json({ success:"false", error:"Not found" })
  }).catch((error) => {
    res.status(500).json({ success: "false", error: [error.message] });
  })
}

exports.updateUser = (req, res) => {
  const toUpdate = aux.filterObjectKeys(req.body, userKeys);
  User.findOne({ where: {id: req.params.userId } }).then((user) => {
    if (user) {
      user.update(toUpdate).then((userUpdated) => {
        res.status(200).json(aux.filterObjectKeys(userUpdated.toJSON(), [...userKeys, "id"]));
      }).catch((error) => {
        res.status(500).json( { success: "false", error});
      });
    } else
      res.status(404).json({ success:"false", error:"Not found" });
  }).catch((error) => {
    res.status(500).json( { success: "false", error});
  });
}

exports.deleteUser = (req, res) => {
  User.destroy({ where: { id: req.params.userId } })
    .then((result) => {
      if (result)
        res.status(200).json(result);
      else
        res.status(404).json({ success:"false", error:"Not found" })
    }).catch((error) => {
      res.status(500).json({ success: "false", error });
    })
}