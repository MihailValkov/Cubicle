const controllers = require('../controllers/cubs');

module.exports = (app) => {
    app.get('/', controllers.getCubes)
    app.get('/create',controllers.getCreate )
    app.post('/create',controllers.postCreate )
    app.get('/about', controllers.getAbout)
    app.get('/details/:id', controllers.getDetails)
    app.get('/delete/:id', controllers.getDelete)
    app.get('/update/:id', controllers.getUpdate)
    app.post('/update/:id', controllers.postUpdate)
    app.get('/attach/accessory/:id',controllers.getAttachAccessory)
    app.post('/attach/accessory/:id',controllers.postAttachAccessory)

    app.get('/create/accessory',controllers.getCreateAccessory)
    app.post('/create/accessory',controllers.postCreateAccessory)
    app.all ('*',controllers.errorHandler)
};