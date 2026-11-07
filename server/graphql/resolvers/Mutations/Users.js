import dotenv from 'dotenv'
dotenv.config();
import Users from '../../../models/users.js';
import Games from '../../../models/games.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const secretKey = process.env.JWT_SECRET || 'supersecretjwtkeyforgamestoredev';
//Later from ENV file

const existingCheck = async (email, username) => {
    const existingEmail = await Users.findOne({email: email})
    const existingUsername = await Users.findOne({username: username})
    if (existingEmail) {
        throw new Error("Email already exists");
    }
    if (existingUsername) {
        throw new Error("Username already exists");
    }
}

const updatePreferences= async (userId, gameId) => {
    const game = await Games.findById(gameId);
    const categories = game.categories;
    const user = await Users.findById(userId);
    for (let i = 0; i < categories.length; i++) {
        if (!user.preferences.includes(categories[i])) {
            await Users.findByIdAndUpdate(userId, {$push: {preferences: categories[i]}}, {new: true});
        }
    }
}

const Mutations = {
    async registerUser(_, {user}) { 
        try {
            existingCheck(user.email, user.username)
            user.password = await bcrypt.hash(user.password, 10);
            const newUser = await Users.create(user);
            const token = jwt.sign({userId: newUser._id, name: `${newUser.firstName} ${newUser.lastName}`}, secretKey, {expiresIn: '7d'});
            return {token, newUser}
        } catch (error) {
            throw new Error(error);
            
        }
    },

    async loginUser(_, {email, password}) {
        const user = await Users.findOne({email});
        if (!user) {
            throw new Error('User not found');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({userId: user._id, name: `${user.firstName} ${user.lastName}`}, secretKey, {expiresIn: '7d'});
        return {token, user};
    },
    
    async editUser(_, {_id, user}) {
        existingCheck(user.email, user.username);
        return await Users.findByIdAndUpdate({_id}, user, {new: true});
    },

    async deleteUser(_, {_id}) {
        return await Users.findByIdAndDelete(_id);
    },

    async addGameToUser(_, {userID, gameID}) {
        await updatePreferences(userID, gameID);
        return await Users.findByIdAndUpdate(userID, {$push: {ownedGames: gameID}}, {new: true});
    },

    async addGameToUserCart(_, {userID, gameID}) {
        return await Users.findByIdAndUpdate(userID, {$push: {cart: gameID}}, {new: true});
    },

    async removeGameFromUserCart(_, {userID, gameID}) {
        return await Users.findByIdAndUpdate(userID, {$pull: {cart: gameID}}, {new: true});
    },

    async addPreference(_, {userId, categoryId}) {
        return await Users.findByIdAndUpdate(userId, {$push: {preferences: categoryId}}, {new: true});
    },

    async addPreferences(_, {userId, categoryIds}) {
        console.log(userId, categoryIds)
        return await Users.findByIdAndUpdate(userId, {$push: {preferences: {$each: categoryIds}}}, {new: true});
    }
}

export default Mutations;

//will need middleware for edit and login to check for duplicates