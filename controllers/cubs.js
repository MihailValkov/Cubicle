
const CubeModel = require('../models/db_cube');
const AccessoryModel = require('../models/db_accessory');
async function getCubes (req,res,next) {
    try {
        let {search, from, to} = req.query ;
        let cubes;
        if (search,from,to) {
            cubes = await CubeModel.find({name: new RegExp('^'+search+'$', "i"), difficultyLevel : {$gte:from , $lte :to}}).lean()
        } else {
            cubes = await CubeModel.find({}).lean();
        }
        res.render('index.hbs', {cubes})
    } catch (error) {
        next(error)
    }

}

function getCreate (req,res,next) {
    res.render('create.hbs')
}
function postCreate (req,res,next) {  
const {name ,description,imageUrl,difficultyLevel} = req.body;
new CubeModel({name ,description,imageUrl,difficultyLevel}).save()
.then(()=> res.redirect('/'))
.catch(next)
    
}
function getAbout(req,res) {
    res.render('about.hbs')
}
function getDetails (req,res,next) {
    const id = req.params.id;
    CubeModel.findById(id).populate('accessories').then(cube=> {
        const accessories = cube.accessories.map(x=> x= {imageUrl : x.imageUrl, description:x.description ,name :x.name});
        res.render('details.hbs',{name:cube.name, description :cube.description, imageUrl:cube.imageUrl, difficultyLevel : cube.difficultyLevel,id :cube._id,accessories})
    }).catch(next)
}
function errorHandler (req,res) {
    res.render('404.hbs')
}
function getDelete (req,res,next) {
    const id = req.params.id;
    CubeModel.findByIdAndRemove(id).then(()=> {
        res.redirect('/')
    }).catch(next)
}
function getUpdate (req,res,next) {
    const id = req.params.id;
    CubeModel.findById(id).then(cube=> {
        res.render('update.hbs', cube)
    })
    .catch(next)
}
function postUpdate(req,res,next) {
    const id = req.params.id;
    CubeModel.findByIdAndUpdate(id, {...req.body}).then(()=> res.redirect(`/details/${id}`))
    .catch(next)
}
function getAttachAccessory (req,res,next) {
    const id= req.params.id;
    Promise.all([CubeModel.findById(id),AccessoryModel.find({cubes :{ $nin : id }})])
    .then(([cube,accessories])=> {
        accessories = accessories.map(x=> x = {id :x.id, name :x.name})
        res.render('attachAccessory.hbs',{cubeName:cube.name,cubeImageUrl :cube.imageUrl,cubeId :cube.id,accessories})

    })
}
function postAttachAccessory (req,res,next) {
    const cubeId = req.params.id;
    const {accessory :accessoryId} = req.body
    Promise.all([CubeModel.findByIdAndUpdate(cubeId, { $addToSet : {accessories : [accessoryId]}}),
    AccessoryModel.findByIdAndUpdate(accessoryId, { $addToSet : {cubes : [cubeId]}})])
    .then(()=>res.redirect('/')).catch(next);
}

function getCreateAccessory(req,res,next){
    res.render('createAccessory.hbs')
}
function postCreateAccessory(req,res,next){
    const data= req.body;
    new AccessoryModel(data).save().then(()=> res.redirect('/')).catch(next)
}

module.exports = {
    getCubes,getCreate,postCreate,getAbout,getDetails,errorHandler,getDelete,getUpdate,postUpdate,
    getAttachAccessory,postAttachAccessory,getCreateAccessory,postCreateAccessory
}