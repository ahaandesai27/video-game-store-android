import Categories from '../../../models/categories.js';   
import Reviews from '../../../models/reviews.js';

//These are the nested queries after querying a game.

const Game = {
    async categories(parent) {
        return await Categories.find({ _id: { $in: parent.categories } });
    },

    async reviews(parent) {
        return await Reviews.find({ game: parent._id });
    }
}   

export default Game;