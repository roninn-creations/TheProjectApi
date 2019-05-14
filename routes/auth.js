const router = require('express').Router();
const controller = require('../controllers/auth');
const auth = require('../services/auth');

router.post('/', controller.register);

router.get('/', auth.any, controller.jwt);

router.get('/basic', controller.basic);

router.post('/google', controller.google);

router.post('/facebook', controller.facebook);

router.get('/google/callback', controller.googleCallback);

router.get('/facebook/callback', controller.facebookCallback);

module.exports = router;
