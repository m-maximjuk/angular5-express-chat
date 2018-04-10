const mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  Schema = mongoose.Schema;

//= ===============================
// Workspace Schema
//= ===============================

const WorkspaceSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true
    },
    name: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

//= ===============================
// Workspace ORM Methods
//= ===============================

// Pre-save of workspace to database, hash password if password is modified or new
WorkspaceSchema.pre('save', function (next) {
  const workspace = this,
    SALT_FACTOR = 5;

  if (!workspace.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(workspace.password, salt, null, (err, hash) => {
      if (err) return next(err);
      workspace.password = hash;
      next();
    });
  });
});

// Method to compare password for login
WorkspaceSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Workspace', WorkspaceSchema);
