const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    todo: {
      type: String,
      required: [true, 'Todo text is required'],
      trim: true,
      maxlength: [200, 'Todo cannot be more than 200 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Todo', todoSchema);