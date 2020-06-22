const mongoose = require('mongoose');
const accessorySchema = new mongoose.Schema({
    name : { type : String , required :true},
    imageUrl : { type : String},
    description : {type : String},
    cubes : [{ type : mongoose.Schema.Types.ObjectId , ref : "Cube"}]
})
const AccessoryModel = mongoose.model('Accessories', accessorySchema);

module.exports =  AccessoryModel;