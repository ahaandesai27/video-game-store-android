 const typeDefs = `#graphql
    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!           #encrypted
        firstName: String!
        lastName: String!
        createdAt: Date!
        age: Int!
        reviews: [Review]
        preferences: [Category]
        ownedGames(offset: Int, limit: Int): [Game]
        cart(offset: Int, limit: Int): [Game]
        about: String
    }

    type AuthPayLoad {
        token: String!
        user: User!
    }

    extend type Query {
        users: [User]
        user(_id: ID!): User
    }

    extend type Mutation {
        loginUser(email: String!, password: String!): AuthPayLoad
        registerUser(user: AddUserInput!): AuthPayLoad
        editUser(_id: ID!, user: EditUserInput!): User
        deleteUser(_id: ID!): User
        addGameToUser(userID: ID!, gameID: ID!): User
        addGameToUserCart(userID: ID!, gameID: ID!): User
        removeGameFromUserCart(userID: ID!, gameID: ID!): User
        addPreference(userID: ID!, categoryID: ID!): User
        addPreferences(userId: ID!, categoryIds: [ID]!): User
    }

    input AddUserInput {
        username: String!
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        age: Int!
    }

    input EditUserInput {
        username: String
        email: String
        password: String
        firstName: String
        lastName: String
        age: Int
    }

`

export default typeDefs;