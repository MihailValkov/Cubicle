const UserModel = require("../models/db_user");
const jwt = require('jsonwebtoken');

async function postRegister(req, res) {
  const { username, password, repeatPassword } = req.body;
  try {
    if (password !== repeatPassword) {
      throw new Error("Password and repeat password don't match");
    }
    const user = await UserModel.findOne({ username });
    if (user) {throw new Error("Username is already taken!");}
      await UserModel.create({ username, password})
      return res.redirect("/login");
  } catch (error) {
    const message= (error.message.split(':')[error.message.split(':').length-1]).includes('Path') ? "Please fill all fields!" :
    error.message.split(':')[error.message.split(':').length-1];
    res.render("register.hbs",{message});
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
        if(!user) { throw new Error('Username or password is wrong!')}
        const match = await user.matchPassword(password,user.password)
        if(!match) { throw new Error('Username or password is wrong!')}
        const token = jwt.sign({username ,id:user._id},process.env.PRIVATE_KEY);
        res.cookie('auth-user',token).redirect('/');
    } catch (error) {
        res.render('login.hbs',{message:error.message});
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
     if (!token && (req.path==='/' || req.path===`/details/${req.params.id}`)){
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
