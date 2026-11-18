const bcrypt =require('bcrypt');
const User =require('../models/User');

const saltRounds = 10;

exports.register =async (req, res, next) => {
  try {
    const existing =await User.findOne({ email: req.body.email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'That email is already registered' });
    }

    const hashedPassword =await bcrypt.hash(req.body.password, saltRounds);
    const user =await User.create({ ...req.body, password: hashedPassword });

    //toJSON removes the password hash
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    const passwordMatches = user && (await bcrypt.compare(req.body.password, user.password));

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};
