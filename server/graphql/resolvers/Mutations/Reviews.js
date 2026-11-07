import Reviews from '../../../models/reviews.js'; 
import Games from '../../../models/games.js'; 
import Users from '../../../models/users.js';  

const Mutations = {
    async addReview(_, { review }) {
        if (review.rating < 1 || review.rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }
        const newReview = await Reviews.create(review);
        const game = await Games.findByIdAndUpdate(review.game, { $push: { reviews: newReview._id } }, { new: true });
        const user = await Users.findByIdAndUpdate(review.user, { $push: { reviews: newReview._id } }, { new: true });
        return newReview;
    },

    async editReview(_, { _id, review }) {
        const updatedReview = await Reviews.findByIdAndUpdate(_id, review, { new: true });
        return updatedReview;
    },

    async deleteReview(_, { _id }) {
        const deletedReview = await Reviews.findByIdAndDelete(_id);
        const game = await Games.findByIdAndUpdate(deletedReview.game, { $pull: { reviews: _id } }, { new: true});
        const user = await Users.findByIdAndUpdate(deletedReview.user, { $pull: { reviews: _id } }, { new: true});
        return deletedReview;
    }
}

export default Mutations;