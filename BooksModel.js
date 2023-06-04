const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  comments: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model("Book", BookSchema);
