const User = require('../models/user');
const passport = require('passport');
const oauth = require('../services/oauth');
const passwordRule = require('../config').passwordRule;

exports.register = (req, res, next) => {
    if (!req.body.password || !req.body.password.match(passwordRule)) return res.status(400).json({
        message: 'Invalid password: Minimum 8 character, 1 lowercase, 1 uppercase, 1 number'
    });
    if (req.body.password !== req.body.password2) return res.status(400).json({
        message: 'Passwords do not match'
    });
    const user = new User(User.fromRequest(req));
    user.save()
        .then(user => res.status(201).json(user.authInfo()))
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(400).json({message: 'User already exists with email: ' + user.email});
            }
        });
};

exports.basic =  (req, res, next) => {
    passport.authenticate('basic', { session: false },(err, user) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({message: 'Incorrect email or password'});
        return res.json(user.authInfo());
    })(req,res,next);
};

exports.google =  (req, res, next) => {
    passport.authenticate('google',{ session: false, scope: ['email', 'profile'], state: 'valid'})(req,res,next);
};

exports.googleCallback =  (req, res, next) => {
    if (req.query.state !== 'valid') return res.status(400).json({ message:'Invalid request' });
    passport.authenticate('google', { session: false }, (err, user, token) => {
        if (err) return next(err);
        if (user) return res.json(user.authInfo());
        oauth.getGoogleProfile(token, (err, profile) => {
                if (err) return next(err);
                if (!profile) return res.status(500).json({ message: 'Failed to connect to Google' });
                User.findOne({ 'email': profile.email }, (err, user) => {
                    if (err) return next(err);
                    if (user) {
                        user.googleId = profile.googleId;
                        user.save((err, user) => {
                            if (err) return next(err);
                            return res.json(user.authInfo());
                        });
                    } else {
                        const newUser = new User(profile);
                        newUser.save((err, user) => {
                            if (err) return next(err);
                            return res.status(201).json(user.authInfo());
                        })
                    }
                });
            });
    })(req,res,next);
};

exports.facebook =  (req, res, next) => {
    passport.authenticate('facebook', { session: false, scope: ['email'], state: 'valid' })(req,res,next);
};

exports.facebookCallback =  (req, res, next) => {
    if (req.query.state !== 'valid') return res.status(400).json({ message:'Invalid request' });
    passport.authenticate('facebook', { session: false }, (err, user, token) => {
        if (err) return next(err);
        if (user) return res.json(user.authInfo());
        oauth.getFacebookProfile(token, (err, profile) => {
            if (err) return next(err);
            if (!profile) return res.status(500).json({ message: 'Failed to connect to Facebook' });
            User.findOne({ 'email': profile.email }, (err, user) => {
                if (err) return next(err);
                if (user) {
                    user.facebookId = profile.facebookId;
                    user.save((err, user) => {
                        if (err) return next(err);
                        return res.json(user.authInfo());
                    });
                } else {
                    const newUser = new User(profile);
                    newUser.save((err, user) => {
                        if (err) return next(err);
                        return res.status(201).json(user.authInfo());
                    })
                }
            });
        });
    })(req,res,next);
};

exports.getUser = (req, res, next) => {
    return res.json(req.user.view());
};

exports.profile = (req, res, next) => {
    // oauth.getGoogleProfile('ya29.Glv9Brh-JMB9oyFBUbroy-l9dBWr5aKru5t5mj6uzMnNuv7hft3HryfXtHS-Z6vA7L5_vK6J9xu-hSxeL5iDVOAmi2VS6IbC3I8gEDs6rEDIA1mREjrinh_Sgci3',
    //     (err, profile) => {
    //         if (err) return next(err);
    //         if (!profile) return res.status(500).json({ message: 'Failed to connect to Google' });
    //         return res.json(profile);
    //     });
    oauth.getFacebookProfile('EAAEvEQu0oMIBAGNayYzAdITVDrI44SQfvRgJ8Q6fQ6sZAA439JCWZBXWIQoaVG4ZCaefFouKDVgtxrrBYJ7NZA6thAVqoswL4m561BlKfhkYrx5NR3duXJavl6kmjz3rqIZCjCidSZA1v1ZCG0hBm1rfT29wJxcSsLWMFVZBUR4meAZDZD',
        (err, profile) => {
        if (err) return next(err);
        if (!profile) return res.status(500).json({ message: 'Failed to connect to Facebook' });
        return res.json(profile);
    });

};
