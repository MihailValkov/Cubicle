const mongoose = require("mongoose");
const accessorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (x) {
        return /^[A-Za-z0-9 ]+$/.test(x);
      },
      message: (x) =>
        "Accessory name should consist only English letters, digits and white-spaces",
    },
    minlength: [5, "Accessory name should be at least 5 characters long!"],
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
  cubes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cube" }],
});
const AccessoryModel = mongoose.model("Accessories", accessorySchema);

module.exports = AccessoryModel;
