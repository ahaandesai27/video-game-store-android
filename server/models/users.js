import { Schema, model } from "mongoose";

const Users = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
          validator: function(v) {
            // Regular expression for validating an email
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(v);
          },
          message: props => `${props.value} is not a valid email address!`
        }
      },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    age: {
        type: Number,
        required: true,
    },
    ownedGames: {
        type: [Schema.Types.ObjectId],
        ref: 'Game',
        default: [],
    },
    cart: {
        type: [Schema.Types.ObjectId],
        ref: 'Game',
        default: [],
    },
    preferences: {
        type: [Schema.Types.ObjectId],
        ref: 'Category',
        default: [],
    },
    about: {
        type: String,
        default: ''
    },
    pfp: {
        type: String,
    }
})

export default model('Users', Users);