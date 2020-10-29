const User = require('../models/user.model')

exports.create = async (user) => {
  email =  user.email;
  country = user.country;
  phonenumber = user.phonenumber;
  birthdate = user.birthdate;
  firstname = user.firstname;
  lastname = user.lastname;

  const { id } = await User.create({ 
    email,
    country,
    phonenumber,
    birthdate,
    firstname,
    lastname
  })
}

/*
exports.remove = async (req, res, next) => {
	try {
        const { id } = req.params
       
        if (await User.destroy({ where: { id } })) {
            res.json({ success: true })
        }
    } catch (error) { 
        res.json({ success: false, error: 'Invalid ID' })
    }
}

exports.findOne = async (req, res, next) => {
	try {
        const { id } = req.params 
        res.json(await User.findOne({ where: { id } }))
    } catch (error) { 
        res.json({ success: false, error: error.message })
    }
}

exports.findAll = async (req, res, next) => {
    res.json(await User.findAll())
}
*/