const User = require('../models/user.model')

exports.create = async (req, res, next) => {
	try {
    	const username = req.body.username
    	const firstname = req.body.firstname
    	const lastname = req.body.lastname

    const { id } = await User.create({ 
      	username,
      	firstname,
      	lastname
    })

    res.json({ success: true, id })
  	} catch (error) {
    	res.status(500)
   		res.json({ success: false, error: error.message })
  	}
}


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