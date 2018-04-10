const Message = require('../models/message');

exports.getMessages = function (req, res, next) {
  let oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  Message.find({"createdAt": {"$gte": oneWeekAgo}})
    .sort('createdAt')
    .populate({
      path: 'author',
      select: 'username'
    })
    .exec((err, messages) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      return res.status(200).json({ messages: messages });
    });
};

exports.send = function (req, res, next) {
  const message = new Message({
    body: req.body.message,
    author: req.user._id,
    workspace: req.body.workspace
  });

  message.save((err, sentReply) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    return res.status(200).json({ message: 'successfully sent!' });
  });
};
