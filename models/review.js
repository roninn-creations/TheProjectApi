const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    place: {
        type: mongoose.Schema.ObjectId,
        ref: 'place',
        required: true,
        index: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [0, 'Invalid rating'],
        max: [5, 'Invalid rating'],
        validate: {
            validator: Number.isInteger,
            message: 'Invalid rating'
        }
    },
    comment: {
        type: String,
        maxLength: 500,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (obj, ret) => { delete ret._id }
    },
    collation: {
        locale: "en"
    }
});

schema.pre('validate', done => {
    delete this.createdAt;
    delete this.updatedAt;
    done();
});

schema.methods = {
    view() {
        return {
            id: this.id,
            user: this.user.view(),
            place: this.place,
            rating: this.rating,
            comment: this.comment
        }
    }
};

module.exports = mongoose.model('review', schema);
