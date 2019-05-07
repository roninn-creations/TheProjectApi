const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config').jwt.secret;
const jwtExpr = require('../config').jwt.exprDays;

const roles = ['user', 'admin'];
const rolesEnum = {values: roles, message: 'Invalid role'};

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        index: true,
        trim: true
    },
    googleId: String,
    facebookId: String,
    role: {
        type: String,
        enum: rolesEnum,
        default: 'user'
    },
    picture: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    collation: {
        locale: "en"
    }
});

userSchema.post('validate', function(user, done) {
    if (this.password && (this.isModified('password') || this.isNew)) {
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) return done({message: 'Hashing failed'});
            user.password = hash;
            return done(null, user);
        });
    } else {
        return done(null, user);
    }
});

userSchema.methods = {
    getView() {
        return {
            id: this.id,
            name: this.name,
            picture: this.picture
        };
    },

    validatePassword(password, done) {
        bcrypt.compare(password, this.password, (err, isValid) => {
            return done(err, isValid);
        });
    },

    generateJWT() {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + jwtExpr);

        return jwt.sign({
            id: this.id,
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, jwtSecret);
    },

    getAuthInfo() {
        return {
            user: this.getView(),
            token: this.generateJWT()
        };
    }
};

userSchema.statics = {
    create(user) {
        delete user.id;
        delete user.createdAt;
        delete user.updatedAt;
        return new mongoose.model('user', userSchema)(user);
    },

    normalize(user) {
        delete user.id;
        delete user.createdAt;
        delete user.updatedAt;
        return user;
    }
};

module.exports = mongoose.model('user', userSchema);
