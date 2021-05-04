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
    }
});

// add user avatar
UserSchema.pre('save', function(next) {
    this.avatar = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRdkbq94femIoLAMtceCNg8WHG45ohMIRBVsICS_9S9JbC0Iz2vQIo8q6Er_MH9NLRpg4&usqp=CAU`;
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
