const user_controller = require('../crud/user.crud');

const express = require('express');
const router = express.Router();

const input = require('../../input/input');
const output = require('../../output/output');

router.post('/', async (req, res, next) => {
  try {
    const user = input.create(req.body);
    const id = await user_controller.create(user)
    // Return user Jsonized
    output.userCreated(res, id, user);

  } catch (error) {
    output.error(res, 500, error.message);
  }
});

router.get('/id/:id', async (req, res, next) => {
	try {
    const id = input.readId(req);
    const user = await user_controller.findOne(id);
    if (user != null)
      output.one_user(res, user);
    else
      output.error(res, 404, 'User not found.')

  } catch (error) { 
    output.error(res, 404, error.message);
  }
});

router.get('/id/:id/self', async (req, res, next) => {
	try {
    const id = input.readId(req);
    const user = await user_controller.findOnePrivileged(id);
    if (user != null)
      output.one_user(res, user);
    else
      output.error(res, 404, 'User not found.')

  } catch (error) { 
    output.error(res, 404, error.message);
  }
});

router.put('/id/:id', async (req, res, next) => {
	try {
    let id = input.readId(req);
    const user = input.create(req.body);

    id = await user_controller.updateOrCreate(id, user);
    output.userCreated(res, id, user);

  } catch (error) { 
    console.log(error);
    output.error(res, 500, error.message);
  }
});

router.delete('/id/:id', async (req, res, next) => {
  try {
    const id = input.readId(req);
    if (await user_controller.remove(id))
      output.deleted(res, id);
    else
      output.error(res, 404, 'User not found.');
  } catch (error) {
    output.error(res, 404, error.message);
  }
})

router.patch('/id/:id', async (req, res, next) => {
  try {
    const id = input.readId(req);
    const user = await user_controller.patch(id, req.body);
    if (user)
      output.userPatched(res, id, user);
    else
      output.error(res, 404, 'User not found.');
  } catch (error) {
    console.log(error);
    output.error(res, 404, error.message);
  }
})

/*
router.delete('/armaggedon', async (req, res, next) => {
  try {
    const deleted = await user_controller.removeAll();
    output.removeAll(res, deleted);
  } catch (error) {
    output.error(res, 500, error.message);
  }

})
*/

//router.get('/', user.findAll)

//router.get('/:id', user.findOne)

//router.delete('/:id', user.remove)

module.exports = router;