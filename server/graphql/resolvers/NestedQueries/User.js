//Nested queries after querying a user

import Games from '../../../models/games.js';
import Categories from '../../../models/categories.js';

const User = {
    async ownedGames(parent, { offset = 0, limit = 10 }) {
        return await Games.find({
            _id: {$in: parent.ownedGames}
        }).skip(offset).limit(limit)
    },

    async cart(parent, { offset = 0, limit = 10 }) {
        return await Games.find({
            _id: {$in: parent.cart}
        }).skip(offset).limit(limit)
    },

    async preferences(parent) {
        return await Categories.find({
            _id: {$in: parent.preferences}
        })
    }
}

export default User