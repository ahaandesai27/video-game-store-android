import {Schema, model} from "mongoose"

const Reviews = new Schema({
    game: { type: Schema.Types.ObjectId, ref: "Games", required: true},
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true},
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

export default model('Reviews', Reviews);