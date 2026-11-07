//These are the nested queries after querying a Review
import Games from '../../../models/games.js';
import Users from '../../../models/users.js';

const Review = {
    async game(parent) {
        return await Games.findById(parent.game);
    },

    async user(parent) {
        return await Users.findById(parent.user);
    }
}

export default Review