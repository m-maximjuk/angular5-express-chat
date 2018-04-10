const User = require('../models/user');
const setUserInfo = require('../helpers').setUserInfo;

//========================================
// User Routes
//========================================
exports.viewProfile = function (req, res, next) {
  const userId = req.params.userId;

  if (req.user._id.toString() !== userId) {
    return res.status(401).json({ error: 'Unauthorized user.' });
  }

  User.findById(userId, (err, user) => {
    if (err) {
      res.status(400).json({ error: 'No user could be found.' });
      return next(err);
    }

    return res.status(200).json({ user: setUserInfo(user) });
  });
};
