const mongoose = require("mongoose");

const newSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
      createdAt: {
        type: Date,
        default: () => Date.now(),
      },
      updatedAt: {
        type: Date,
        default: () => Date.now(),
      },
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", newSchema);
