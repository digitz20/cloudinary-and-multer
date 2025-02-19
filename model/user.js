const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        imageUrl: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    },
    postId: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Posts',
    
    }],
 
}, {timestamps: true})


const userModel = mongoose.model('Users', userSchema)

module.exports = userModel