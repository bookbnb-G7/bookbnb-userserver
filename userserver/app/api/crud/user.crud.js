const User = require('../models/user.model')

exports.create = async (user) => {
  const email =  user.email;
  const country = user.country;
  const phonenumber = user.phonenumber;
  const birthdate = user.birthdate;
  const firstname = user.firstname;
  const lastname = user.lastname;

  const { id } = await User.create({ 
    email,
    country,
    phonenumber,
    birthdate,
    firstname,
    lastname
  })
  
  console.log(id);
  return id;
}

exports.findOne = async (id) => {
  return await User.findOne({ where: { id }, attributes: ['firstname', 'lastname', 'email', 'country'] })
}

exports.findOnePrivileged = async (id) => {
  return await User.findOne({ where: { id }, attributes: ['firstname', 'lastname', 'email', 'country', 'phonenumber', 'birthdate'] })
}

exports.remove = async (id) => {
  return User.destroy({ where: { id } })
}

exports.removeAll = async (id) => {
  return User.destroy({ truncate: true })
}

exports.updateOrCreate = async (id, user) => {
  const email =  user.email;
  const country = user.country;
  const phonenumber = user.phonenumber;
  const birthdate = user.birthdate;
  const firstname = user.firstname;
  const lastname = user.lastname;

  const [ user_found, created ] = await User.findOrCreate({
    where: { id: [id] },
    defaults: {
      email,
      country,
      phonenumber,
      birthdate,
      firstname,
      lastname
    }
  });
  
  if (created == false) {
    user_found.email = email;
    user_found.country = country;
    user_found.phonenumber = phonenumber;
    user_found.birthdate = birthdate;
    user_found.firstname = firstname;
    user_found.lastname = lastname;
    await user_found.save();
  }
  
  return id;
}

//Cualitativamente: comentario
//cuantitativamente: nota sobre 5 estrellas


//Rating: rating (int)
//        post_id (int)
//        reviewer_id (int)
//        reviewer_name (str)

exports.patch = async (id, updates) => {
  const user = await User.findOne({ where: { id }})
  if (user) {
    for (let key in updates) {
      if (user[key])
        user[key] = updates[key];
    }
    await user.save();
  }
  return user;
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