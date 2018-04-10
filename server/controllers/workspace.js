const nodemailer = require('nodemailer');

const Workspace = require('../models/workspace');

exports.getWorkspaces = function (req, res, next) {
  Workspace.find({})
    .sort('createdAt')
    .exec((err, workspaces) => {
      if (err) {
        res.send({ error: err });
        return next(err);
      }
      return res.status(200).json({ workspaces: workspaces });
    });
};

exports.createWorkspace = function (req, res, next) {
  // Check for registration errors
  const fullname = req.body.fullname;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // Return error if fullname not provided
  if (!fullname) {
    return res.status(422).send({ error: 'You must enter full name.' });
  }
  // Return error if name not provided
  if (!name) {
    return res.status(422).send({ error: 'You must enter display name.' });
  }
  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.' });
  }
  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }

  Workspace.findOne({'name': name}, (err, existWorkspace) => {
    if (err) { return next(err); }

    // If workspace is not unique, return error
    if (existWorkspace) {
      return res.status(422).send({ error: 'Display name is already in use.' });
    }

    const workspace = new Workspace({
      fullname,
      name,
      email,
      password,
    });

    workspace.save((err, workspace) => {
      if (err) { return next(err); }

      return res.status(200).json({ workspace: workspace });
    });
  });
};

exports.viewWorkspace = function (req, res, next) {
  const workspaceId = req.params.workspaceId;

  Workspace.findById(workspaceId, (err, workspace) => {
    if (err) {
      res.status(400).json({ error: 'No workspace could be found.' });
      return next(err);
    }

    return res.status(200).json({ workspace: workspace });
  });
};

exports.getWorkspace = function (req, res, next) {
  const email = req.body.email;

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.' });
  }

  Workspace.findOne({'email': email}, (err, existWorkspace) => {
    if (err) { return next(err); }

    // If workspace is not unique, return error
    if (existWorkspace) {
      nodemailer.createTestAccount((err, account) => {
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: account.user, // generated ethereal user
              pass: account.pass // generated ethereal password
            }
          });

          // setup email data with unicode symbols
          let mailOptions = {
            from: '"Administrator" <admin@example.com>',
            to: email,
            subject: 'Workspace link',
            text: 'http://localhost:8080/' + existWorkspace._id,
            html: 'http://localhost:8080/' + existWorkspace._id
          };

          // send mail with defined transport object
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(400).send({ error: 'Failed to send email.' });
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            return res.status(200).send({ success: 'Email sent successfully' });
          });
      });
    }
    else {
      return res.status(400).send({ error: 'No workspace could be found' });
    }
  });
};
