const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        validate: {
            validator: async (v) => {
                const users = await User.find({username: v})
                return users.length === 0
            },
            message: 'Username must be unique'
        },
        required: true
    },
    name: {
        type:String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    }
})


userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash
      }
})

const User = mongoose.model('User', userSchema)

module.exports = User