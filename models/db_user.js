const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (x) {
        return /^[A-Za-z0-9]+$/.test(x);
      },
      message: (x) =>
        "Username should consist only with English letters and digits!",
    },
    minlength: [5, "Username should be at least 5 characters long!"],
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (x) {
        return /^[A-Za-z0-9]+$/.test(x);
      },
      message: (x) =>
        "Password should consist only with English letters and digits!",
    },
    minlength: [8, "Password should be at least 8 characters long!"],
  },
});

userSchema.methods = {
    matchPassword : function(password,hashed){
        return bcrypt.compare(password,hashed);
    }
}
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
    } catch (error) {
      next(error);
      return;
    }
  }
  next();
});
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
