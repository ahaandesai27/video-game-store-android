import mongoose, {Schema, model} from "mongoose"

const urlGenerator = (title) => {
    //Grand Theft Auto V -> grand-theft-auto-v
    if (title) {
        return title
            .toLowerCase()
            .split(" ")
            .join("-")
    }
    return ""
}

const Games = new Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    platform: { type: [String], required: true },
    url: {type: String},
    categories: { type: [String], required: true },
    releaseDate: { type: Date, default: Date.now },
    publisher: { type: String, required: true },
    developer: { type: String, required: true },
    coverImage: { type: String, required: true},      
    Images: { type: [String] },
});

Games.pre('save', function(next) {
    if ((this.isModified('title') || this.isNew) && !this.url) {
        this.url = urlGenerator(this.title)
    }
    next();
})

export default model('Games', Games);