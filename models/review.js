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
        return {
            id: this.id,
            user: this.user.getView(),
            place: this.place,
            rating: this.rating,
            comment: this.comment,
            createdAt: this.createdAt
        }
    }
};

reviewSchema.statics = {
    create(review) {
        delete review.id;
        delete review.createdAt;
        delete review.updatedAt;
        return new mongoose.model('review', reviewSchema)(review);
    },

    normalize(review) {
        delete review.id;
        delete review.createdAt;
        delete review.updatedAt;
        return review;
    }
};

module.exports = mongoose.model('review', reviewSchema);
