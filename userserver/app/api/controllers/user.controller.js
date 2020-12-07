const User = require('../../model/user');
const aux = require('../filterObjectKeys');
require('dotenv').config();

const userKeys = ['firstname', 'lastname', 'email', 'country', 'phonenumber', 'birthdate', 'photo'];

exports.createUser = (req, res) => {
  if (!req.headers.access_token || req.headers.access_token != process.env.ACCESS_TOKEN) {
    res.status(403).json({ error: "forbidden" })
    return
  }

  const toCreate = aux.filterObjectKeys(req.body, [...userKeys, "id"]);
  User.create(toCreate).then((newUser) => {
    //newUser contains all the attributes of the table, we want to send the client
    //only the ones in the userKeys list and the 'id'.
    //also newUser needs to be converted to JSON to be able to be filtered.
    res.status(201).json(aux.filterObjectKeys(newUser.toJSON(), [...userKeys, "id"]));
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.getUser = (req, res) => {
  if (!req.headers.access_token || req.headers.access_token != process.env.ACCESS_TOKEN) {
    res.status(403).json({ error: "forbidden" })
    return
  }

  User.findOne({ where: { id: req.params.userId }, attributes: userKeys }).then((user) => {
    if (user)
      res.status(200).json(user);
    else
      res.status(404).json({ success:"false", error:"not found" })
  }).catch((error) => {
    res.status(500).json({ success: "false", error: error.message });
  })
}

exports.getAllUsers = (req, res) => {
  if (!req.headers.access_token || req.headers.access_token != process.env.ACCESS_TOKEN) {
    res.status(403).json({ error: "forbidden" })
    return
  }

  let query = aux.filterObjectKeys(req.query, [...userKeys, "id"]);
  User.findAll({ where: query, attributes: [...userKeys, "id"] }).then((users) => {
    res.status(200).json({ amount: users.length, users: users });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  })
}

exports.updateUser = (req, res) => {
  if (!req.headers.access_token || req.headers.access_token != process.env.ACCESS_TOKEN) {
    res.status(403).json({ error: "forbidden" })
    return
  }

  const toUpdate = aux.filterObjectKeys(req.body, userKeys);
  User.findOne({ where: {id: req.params.userId } }).then((user) => {
    if (user) {
      user.update(toUpdate).then((userUpdated) => {
        res.status(200).json(aux.filterObjectKeys(userUpdated.toJSON(), [...userKeys, "id"]));
      }).catch((error) => {
        res.status(500).json( { error: error.message });
      });
    } else
      res.status(404).json({ error: "not found" });
  }).catch((error) => {
    res.status(500).json({ error: error.message });
  });
}

exports.deleteUser = (req, res) => {
  if (!req.headers.access_token || req.headers.access_token != process.env.ACCESS_TOKEN) {
    res.status(403).json({ error: "forbidden" })
    return
  }

  User.destroy({ where: { id: req.params.userId } })
    .then((result) => {
      if (result)
        res.status(200).json(result);
      else
        res.status(404).json({ error: "not found" })
    }).catch((error) => {
      res.status(500).json({ error: error.message });
    })
}

exports.userExists = async (id) => {
  let user = await User.findOne({ where: {id} });
  return user != null;
}