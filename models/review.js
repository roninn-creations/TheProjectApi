const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
        min: [1, 'Invalid rating: 1-5'],
        max: [5, 'Invalid rating: 1-5'],
        validate: {
            validator: Number.isInteger,
            message: 'Invalid rating: 1-5'
        }
    },
    comment: {
        type: String,
        maxlength: [500, 'Too long comment: maximum 500 characters'],
        trim: true
    }
}, {
    timestamps: true,
    collation: {
        locale: "en"
    }
});

reviewSchema.methods = {
    getView() {
        const user = this.user ? this.user.getView() : {
            id: null,
            name: 'Deleted user',
            picture: null
        };
        return {
            id: this.id,
            user: user,
            place: this.place,
            rating: this.rating,
            comment: this.comment,
            createdAt: this.createdAt
        }
    }
};

reviewSchema.statics = {
    create(review) {
        return new mongoose.model('review', reviewSchema)(this.normalize(review));
    },

    normalize(review) {
        return {
            user: review.user,
            place: review.place,
            rating: review.rating,
            comment: review.comment
        };
    }
};

module.exports = mongoose.model('review', reviewSchema);
