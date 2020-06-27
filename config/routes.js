const controllerCub = require('../controllers/cubs');
const controllerUser = require('../controllers/user');

module.exports = (app) => {
    app.get('/', controllerUser.auth,controllerCub.getCubes)
    app.get('/register',controllerUser.getRegister )
    app.post('/register',controllerUser.postRegister )
    app.get('/login',controllerUser.getLogin )
    app.post('/login',controllerUser.postLogin )
    app.get('/logout',controllerUser.logout )
    app.get('/create',controllerUser.auth,controllerCub.getCreate )
    app.post('/create',controllerUser.auth,controllerCub.postCreate )
    app.get('/about',controllerUser.auth, controllerCub.getAbout)
    app.get('/details/:id',controllerUser.auth, controllerCub.getDetails)
    app.get('/delete/:id', controllerUser.auth,controllerCub.getDelete)
    app.get('/update/:id',controllerUser.auth, controllerCub.getUpdate)
    app.post('/update/:id',controllerUser.auth, controllerCub.postUpdate)
    app.get('/attach/accessory/:id',controllerUser.auth,controllerCub.getAttachAccessory)
    app.post('/attach/accessory/:id',controllerUser.auth,controllerCub.postAttachAccessory)
    app.get('/create/accessory',controllerUser.auth,controllerCub.getCreateAccessory)
    app.post('/create/accessory',controllerUser.auth,controllerCub.postCreateAccessory)
    app.all ('*',controllerCub.errorHandler)
};