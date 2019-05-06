const router = require('express').Router();
const controller = require('../controllers/auth');
const auth = require('../services/auth');

router.post('/', controller.register);

router.get('/', auth.any, controller.getUser);

router.get('/basic', controller.basic);

router.get('/google', controller.google);

router.get('/google/callback', controller.googleCallback);

router.get('/facebook', controller.facebook);

router.get('/facebook/callback', controller.facebookCallback);

module.exports = router;