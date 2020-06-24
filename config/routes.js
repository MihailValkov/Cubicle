const controllerCub = require('../controllers/cubs');
const controllerUser = require('../controllers/user');

module.exports = (app) => {
    app.get('/', controllerCub.getCubes)
    app.get('/register',controllerUser.getRegister )
    app.post('/register',controllerUser.postRegister )
    app.get('/create',controllerCub.getCreate )
    app.post('/create',controllerCub.postCreate )
    app.get('/about', controllerCub.getAbout)
    app.get('/details/:id', controllerCub.getDetails)
    app.get('/delete/:id', controllerCub.getDelete)
    app.get('/update/:id', controllerCub.getUpdate)
    app.post('/update/:id', controllerCub.postUpdate)
    app.get('/attach/accessory/:id',controllerCub.getAttachAccessory)
    app.post('/attach/accessory/:id',controllerCub.postAttachAccessory)
    app.get('/create/accessory',controllerCub.getCreateAccessory)
    app.post('/create/accessory',controllerCub.postCreateAccessory)
    app.all ('*',controllerCub.errorHandler)
};