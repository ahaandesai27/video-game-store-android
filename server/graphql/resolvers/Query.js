import Users from '../../models/users.js';
import Games from '../../models/games.js';
import Reviews from '../../models/reviews.js';
import Categories from '../../models/categories.js';

const Query = {
    //? User Queries
    async users () {
        return await Users.find();
    },
    
    async user(_, {_id}) {
        return await Users.findById(_id);
    },

    //? Game Queries
    async games (_, {limit, offset, newest = false, platform, price, search, category}) {
        const query = {}
        if (platform) {
            query.platform = platform;
        }
        if (price !== undefined) {
            query.price = {$lte: price};
        }
        else {
            query.price = {$gte: 0};
        }
        if (search) {
            query.$text = {$search: search};
        }
        if (category) {
            query.categories = { $in : category};
        }
        const sortOption = newest ? { releaseDate: -1 } : {};
        return await Games.find(query).sort(sortOption).skip(offset).limit(limit);
    },

    async game(_, {_id}) {
        return await Games.findById(_id);
    },

    async gameByUrl (_, {url}) {
        return await Games.findOne({url: url});
    },

    async gamesByPlatform(_, {platform, limit, offset}) {
        return await Games.find({platform: platform}).skip(offset).limit(limit);
    },

    async gamesByPrice(_, {price, limit, offset}) {
        return await Games.find({price: {$lte: price}}).skip(offset).limit(limit);
    },

    async gamesByCategory(_, {categories, limit, offset}) {
        return await Games.find({categories: { $in : categories}}).skip(offset).limit(limit);
    },

    async searchGames(_ , {query, limit, offset}) {
        if (query == "") {
            return await this.games(_, {limit, offset});
        }
        return await Games.find({$text: {$search: query}}).skip(offset).limit(limit);
    },

    //? Review Queries
    async reviewsByGame(_, {game, offset, limit}) {
        //ID
        return await Reviews.find({game: game}).skip(offset).limit(limit);
    },

    async reviewsByUser(_, {user}) {
        //ID
        return await Reviews.find({user: user});
    },

    //? Categories Queries
    async categories () {
        return await Categories.find();
    },


}

export default Query;