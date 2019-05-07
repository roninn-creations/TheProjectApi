const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required'],
            trim: true
        },
        post: {
            type: String,
            required: [true, 'Postal code is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        }
    },
    tags: {
        type: [String],
        validate: {
            validator: (tags) => { return tags.length <= 5 },
            message: 'Too many tags: maximum 5'
        }
    }
}, {
    timestamps: true,
    collation: {
        locale: "en"
    }
});

placeSchema.methods = {
    getView() {
        return {
            id: this.id,
            name: this.name,
            address: this.address,
            tags: this.tags
        }
    },
};

placeSchema.statics = {
    create(place) {
        delete place.id;
        delete place.createdAt;
        delete place.updatedAt;
        return new mongoose.model('place', placeSchema)(place);
    },

    normalize(place) {
        delete place.id;
        delete place.createdAt;
        delete place.updatedAt;
        return place;
    }
};

module.exports = mongoose.model('place', placeSchema);
