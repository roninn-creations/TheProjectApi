const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const OauthStrategy = require('passport-http-bearer').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config');

passport.use('basic', new BasicStrategy(
    function(email, password, done) {
        User.findOne({ 'email': email }, (err, user) => {
            if (err) return done(err);
            if (!user) return done();
            user.validatePassword(password, (err, isValid) => {
                if (err) return done(err);
                if (!isValid) return done();
                return done(null, user)
            });
        });
    }
));

passport.use('google', new GoogleStrategy({
        clientID: config.google.appId,
        clientSecret: config.google.appSecret,
        callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ 'googleId': profile.id }, (err, user) => {
            return done (err, user, accessToken);
        });
    }
));

passport.use('facebook', new FacebookStrategy({
        clientID: config.facebook.appId,
        clientSecret: config.facebook.appSecret,
        callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ 'facebookId': profile.id }, (err, user) => {
            return done (err, user, accessToken);
        });
    }
));

passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt.secret
    },
    function(jwtPayload, done) {
        User.findById(jwtPayload.id, (err, user) => {
            return done(err, user)
        });
    }
));

// passport.use('oauth', new BearerStrategy(
//     function(token, done) {
//         User.findOne({ token: token }, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }
//             return done(null, user, { scope: 'read' });
//         });
//     }
// ));


