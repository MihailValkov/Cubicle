const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
    name : { type : String , required :true},
    description : { type : String , required :true},
    imageUrl : { type : String },
    difficultyLevel : {type : Number , required :true , min:1 , max:10},
    accessories : [ { type : mongoose.Schema.Types.ObjectId , ref : "Accessories"}]

});

const CubeModel = mongoose.model('Cube', cubeSchema);
module.exports = CubeModel;