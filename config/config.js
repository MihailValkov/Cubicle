module.exports = {
    development: {
        port: process.env.PORT || 3000,
        // dataBase : `mongodb+srv://${process.env.USER}:${process.env.PASS}@db.exhqa.mongodb.net/Cubes_DB`
        dataBase : `mongodb+srv://guest:guest123456@db.exhqa.mongodb.net/Cubes_DB`
    },
    production: {}
};