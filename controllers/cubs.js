const CubeModel = require("../models/db_cube");
const AccessoryModel = require("../models/db_accessory");
const isAuthUser = (req, res, page, cubes) => {
  const isAuth = !!req.user;
  if (isAuth) {
    const username = req.user.username;
    return res.render(page, { ...cubes, isAuth, username });
  }
  res.render(page, { ...cubes });
};
async function getCubes(req, res, next) {
  try {
    let { search, from, to } = req.query;
    let cubes;
    if ((search, from, to)) {
      cubes = await CubeModel.find({
        name: new RegExp(search, "i"),
        difficultyLevel: { $gte: from, $lte: to },
      }).lean();
    } else {
      cubes = await CubeModel.find({}).lean();
    }
    await isAuthUser(req, res, "index.hbs", { cubes });
  } catch (error) {
    next(error);
  }
}

function getCreate(req, res, next) {
  isAuthUser(req, res, "create.hbs");
}
function postCreate(req, res, next) {
  const { name, description, imageUrl, difficultyLevel } = req.body;
  new CubeModel({ name, description, imageUrl, difficultyLevel, creator:req.user.id })
    .save()
    .then(() => res.redirect("/"))
    .catch(error=> {
      const message= error.message.includes('Path') ? "Please fill all fields!" :
      error.message.split(': ')[error.message.split(': ').length-1];
      const isAuth =  !!req.user
      res.render('create.hbs',{...req.body,isAuth,username:req.user.username,message})
    });
}
function getAbout(req, res) {
  isAuthUser(req, res, "about.hbs");
}
function getDetails(req, res, next) {
  const id = req.params.id;
  CubeModel.findById(id)
    .lean()
    .populate("accessories")
    .then((cube) => {
        const isCreator = cube.creator === req.user.id;
      isAuthUser(req, res, "details.hbs", {
        id: cube._id,
        ...cube,
        accessories: cube.accessories,
        isCreator
      });
    })
    .catch(next);
}
function errorHandler(req, res) {
  isAuthUser(req, res, "404.hbs");
}
function getDelete(req, res, next) {
  const id = req.params.id;
  CubeModel.findByIdAndRemove(id)
    .then(() => {
      res.redirect("/");
    })
    .catch(next);
}
function getUpdate(req, res, next) {
  const id = req.params.id;
  CubeModel.findById(id)
    .lean()
    .then((cube) => {
      const {difficultyLevel} = cube;
      const options = selectOptionsRender(difficultyLevel)
      isAuthUser(req, res, "update.hbs", { ...cube,options });
    })
    .catch(next);
}
function selectOptionsRender(difficultyLevel) {
  return [{ 1: "1 - Very Easy" }, { 2: "2 - Easy" }, { 3: "3 - Medium (Standard 3x3)" },
  { 4: "4 - Intermediate" }, { 5: "5 - Expert" }, { 6: "6 - Hardcore" }]
    .map(x => {
      x = { value: Object.keys(x)[0], info: Object.values(x)[0] };
      if (+x.value === +difficultyLevel) {
        x.selected = true;
      }
      return x;
    });
}

function postUpdate(req, res, next) {
  const id = req.params.id;
  CubeModel.findByIdAndUpdate(id, { ...req.body }, {runValidators:true})
    .then(() => res.redirect(`/details/${id}`))
    .catch(
      error=> {
        const message= error.message.includes('Path') ? "Please fill all fields!" :
        error.message.split(': ')[error.message.split(': ').length-1];
        const isAuth =  !!req.user
        const options = selectOptionsRender(req.body.difficultyLevel)
        res.render('update.hbs',{_id:req.params.id,...req.body,isAuth,username:req.user.username,message,options})
      });
}
function getAttachAccessory(req, res, next) {
  const id = req.params.id;
  Promise.all([
    CubeModel.findById(id).lean(),
    AccessoryModel.find({ cubes: { $nin: id } }).lean(),
  ]).then(([cube, accessories]) => {
    isAuthUser(req, res, "attachAccessory.hbs", { ...cube, accessories });
  });
}
function postAttachAccessory(req, res, next) {
  const cubeId = req.params.id;
  const { accessory: accessoryId } = req.body;
  Promise.all([
    CubeModel.findByIdAndUpdate(cubeId, {
      $addToSet: { accessories: [accessoryId] },
    }),
    AccessoryModel.findByIdAndUpdate(accessoryId, {
      $addToSet: { cubes: [cubeId] },
    }),
  ])
    .then(() => res.redirect("/"))
    .catch(next);
}

function getCreateAccessory(req, res, next) {
  isAuthUser(req, res, "createAccessory.hbs");
}
function postCreateAccessory(req, res, next) {
  const data = req.body;
  new AccessoryModel(data)
    .save()
    .then(() => res.redirect("/"))
    .catch( error=> {
      const message= error.message.includes('Path') ? "Please fill all fields!" :
      error.message.split(': ')[error.message.split(': ').length-1];
      const isAuth =  !!req.user
      res.render('createAccessory.hbs',{...req.body,isAuth,username:req.user.username,message})
    });
}

module.exports = {
  getCubes,
  getCreate,
  postCreate,
  getAbout,
  getDetails,
  errorHandler,
  getDelete,
  getUpdate,
  postUpdate,
  getAttachAccessory,
  postAttachAccessory,
  getCreateAccessory,
  postCreateAccessory,
};
