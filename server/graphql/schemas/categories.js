const typeDefs = `#graphql
    type Category {
        _id: ID!
        name: String!
    }
    extend type Query {
        categories: [Category]
    }

    extend type Mutation {
        addCategory(name: String!): Category
        deleteCategory(_id: ID!): Category
    }
`;

export default typeDefs;