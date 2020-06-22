const env = process.env.NODE_ENV || 'development';
global.__basedir = __dirname;
const mongoose = require('mongoose')


const config = require('./config/config')[env];
const app = require('express')();

require('./config/express')(app);
require('./config/routes')(app);

app.listen(config.port, ()=> {
    console.log(`The Server is listening on port ${config.port}!`);
    mongoose.connect(config.dataBase,{ useNewUrlParser: true , useUnifiedTopology: true },(err)=> {
        if(err) {
            console.log('Something is wrong'); return ;
        }
        console.log('DataBase is setup and running!');
    })
});