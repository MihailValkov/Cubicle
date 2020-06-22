module.exports = {
    development: {
        port: process.env.PORT || 3000,
        dataBase : `mongodb+srv://${process.env.USER}:${process.env.PASS}@db.exhqa.mongodb.net/Cubes_DB`
    },
    production: {}
};