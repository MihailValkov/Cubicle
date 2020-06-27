const mongoose = require("mongoose");

const cubeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (x) {
        return /^[A-Za-z0-9 ]+$/.test(x);
      },
      message: (x) =>
        "Cube name should consist only English letters, digits and white-spaces",
    },
    minlength: [5, "Cube name should be at least 5 characters long!"],
  },
  description: {
    type: String,
    required: true,
    validate: {
      validator: function (x) {
        return /^[A-Za-z0-9 ]+$/.test(x);
      },
      message: (x) =>
        "Description should consist only English letters, digits and white-spaces",
    },
    minlength: [20, "Description should be at least 20 characters long!"],
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function (x) {
        return /^https:\/\/.+|^http:\/\/.+/.test(x);
      },
      message: (x) => "Image url should starts with http:// or https://",
    },
  },
  difficultyLevel: { type: Number, required: true, min: 1, max: 6 },
  accessories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accessories" }],
  creator: {
    type: String,
  },
});

const CubeModel = mongoose.model("Cube", cubeSchema);
module.exports = CubeModel;
