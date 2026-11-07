import {Schema, model} from "mongoose"

const Categories = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
});

export default model('Categories', Categories);