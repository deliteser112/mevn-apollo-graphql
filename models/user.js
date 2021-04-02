const mongoose = require('mongoose');
const md5 = require('md5');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String
    },
    joinDate: {
        type: Date,
        default: Date.now()
    },
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: 'Post'
    }
});

// add user avatar
UserSchema.pre('save', function(next) {
    this.avatar = `https://gravatar.com/avatar/${md5(this.username)}?d=identicon`;
    next();
});

// hash password
UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    bcrypt.hash(this.password, 10).then(hash => {
        this.password = hash;
        next();
    });

});


module.exports = mongoose.model('User', UserSchema);
