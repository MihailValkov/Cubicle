const UserModel = require("../models/db_user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

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
function getLogin(req, res) {
    res.render("login.hbs");
  }
async function postLogin(req, res) {
    const {username,password}= req.body;
    try {
        const user= await UserModel.findOne({username});
        if(!user) { throw new Error('User is not found!')}
        const match = await bcrypt.compare(password,user.password);
        if(!match) { throw new Error('Password is wrong!')}
        const token = jwt.sign({username ,id:user._id},process.env.PRIVATE_KEY);
        res.cookie('auth-user',token);
        return res.redirect('/');
    } catch (error) {
        res.redirect('/login');
  }
}

function auth(req,res,next){
    const token = req.cookies['auth-user'];
    if(token) {
      const user = jwt.verify(token,process.env.PRIVATE_KEY);
      if(!user) {
          return res.redirect('/login')
      }
         req.user=user;
         return next();
     }
     if (!token && req.path==='/'){
       return next()
     }
     return res.redirect('/login')
}
function logout(req, res) {
  res.clearCookie('auth-user');
  return res.status(200).redirect('/');
}

module.exports = {
  postRegister,
  getRegister,
  getLogin,
  postLogin,
  auth,
  logout
};
