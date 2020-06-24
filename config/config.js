module.exports = {
    development: {
        port: process.env.PORT ,
        dataBase : `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@db.exhqa.mongodb.net/Cubes_DB`
    },
    production: {}
};