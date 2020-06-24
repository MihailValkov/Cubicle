const UserModel = require("../models/db_user");
const bcrypt = require("bcrypt");

async function postRegister(req, res, next) {
  const { username, password, repeatPassword } = req.body;
  try {
    if (password !== repeatPassword) {
      throw Error();
    }
    const user = await UserModel.findOne({ username });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      new UserModel({ username, password: hash }).save();

      return res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/register");
  }
}

function getRegister(req, res) {
  res.render("register.hbs");
}

module.exports = {
  postRegister,
  getRegister,
};
