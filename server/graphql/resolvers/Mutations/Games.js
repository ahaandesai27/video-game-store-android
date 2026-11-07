import Games from '../../../models/games.js'

const urlGenerator = (title) => {
    //Grand Theft Auto V -> grand-theft-auto-v
    return title
        .toLowerCase()
        .split(" ")
        .join("-")
}

const existingCheck = async (title) => {
    if (title) {
        const url = urlGenerator(title)
        const existing = await Games.findOne({url: url})
        if (existing) {
            throw new Error("Game already exists");
        }
    }
}


const Mutations = {
    async addGame(_, {game}) {
        await existingCheck(game.title)
        return await Games.create(game);
    },

    async editGame(_, {_id, game}) {
        await existingCheck(game.title)
        return await Games.findByIdAndUpdate({_id}, game, {new: true});
    },

    async deleteGame(_, {_id}) {
        return await Games.findByIdAndDelete(_id);
    }
}

export default Mutations;