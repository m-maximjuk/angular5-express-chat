const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

//= ===============================
// Message Schema
//= ===============================

const MessageSchema = new Schema(
  {
    body: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace'
    }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model('Message', MessageSchema);
