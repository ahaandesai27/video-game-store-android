const typeDefs = `#graphql
    type Review {
        _id: ID!
        game: Game!
        user: User!
        rating: Int!   # /5
        review: String!
        date: Date!
    }

    extend type Query {
        reviewsByGame(game: ID!, offset: Int!, limit: Int!): [Review]
        reviewsByUser(user: ID!): [Review]
    }

    extend type Mutation {
        addReview(review: AddReviewInput!): Review
        editReview(_id: ID!, review: EditReviewInput!): Review
        deleteReview(_id: ID!): Review
    }

    input AddReviewInput {
        game: ID!
        user: ID!
        rating: Int!
        review: String!
    }

    input EditReviewInput {
        rating: Int
        review: String
        date: Date
    }
`;

export default typeDefs;