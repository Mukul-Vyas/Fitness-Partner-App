const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    profilePicture: {
        type: String,
    },

    image: {
        type: String,
        required: true,
    },

    joinedDate: {
        type: Date,
        default: Date.now,
    },
    freindRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    sentFriendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],

    verified: {
        type: Boolean,
        default: false,
    },

    verificationToken: String,



});

const User = mongoose.model("User", userSchema);

module.exports = User;
