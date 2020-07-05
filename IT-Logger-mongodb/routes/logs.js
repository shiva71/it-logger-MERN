const express = require('express');

const router = express.Router();

const Log = require('../models/Logs');

//Express Validator
const { check, validationResult } = require('express-validator');

//@route GET api/logs
//@desc Get Logs
//@acess Public
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find();
    res.json(logs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route POST api/logs
//@desc Get Add logs
//@acess Public
router.post(
  '/',
  [
    check('message', 'Please include a log message').not().isEmpty(),
    check('tech', 'Please Include a Tech name').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { message, tech, attention } = req.body;

    const newLog = new Log({
      message,
      tech,
      attention,
    });
    try {
      const log = await newLog.save();
      res.json(log);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route PUT api/logs
//@desc  Update a log
//@access Public

router.put('/', async (req, res) => {
  const { id, message, tech, attention } = req.body;
  const _id = id;

  try {
    let log = await Log.findById(_id);
    if (!log) {
      res.status(404).json({ msg: 'contact not found' });
    }

    const newLog = {};
    if (message) newLog.message = message;
    if (tech) newLog.tech = tech;
    if (attention) newLog.attention = attention;
    newLog.date = new Date();

    log = await Log.findByIdAndUpdate(
      _id,
      {
        $set: newLog,
      },
      { new: true }
    );
    res.json(log);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  api/logs
//@desc   Delete a log
//@access Public

router.delete('/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    let log = await Log.findById(_id);
    if (!log) {
      res.status(404).json({ msg: 'Log not found' });
    }

    await Log.findByIdAndRemove(_id);
    res.json({ msg: 'Log Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
