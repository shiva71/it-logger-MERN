const express = require('express');

const router = express.Router();

const Tech = require('../models/Techs');

//Express Validator
const { check, validationResult } = require('express-validator');

//@route GET api/techs
//@desc Get Techs
//@acess Public
router.get('/', async (req, res) => {
  try {
    const techs = await Tech.find();
    res.json(techs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route POST api/techs
//@desc Add Tech
//@acess Public
router.post(
  '/',
  [
    check('firstName', 'Please include a First Name').not().isEmpty(),
    check('lastName', 'Please Include a Last Name').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName } = req.body;
    const newTech = new Tech({
      firstName,
      lastName,
    });

    try {
      const tech = await newTech.save();
      res.json(tech);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route  api/techs
//@desc   Delete a Tech
//@access Public

router.delete('/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    let tech = await Tech.findById(_id);
    if (!tech) {
      res.status(404).json({ msg: 'Tech not found' });
    }

    await Tech.findByIdAndRemove(_id);
    res.json({ msg: 'Tech Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
