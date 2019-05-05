const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
            message: 'Maximum 5 tags'
        }
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
    this.createdAt = null;
    this.updatedAt = null;
    done();
});

schema.methods = {
    view() {
        return {
            id: this.id,
            name: this.name,
            address: this.address,
            tags: this.tags,
            createdAt: this.createdAt
        }
    },
};

module.exports = mongoose.model('place', schema);
