import userTypeDefs from './users.js';
import gameTypeDefs from './games.js';
import categoryTypeDefs from './categories.js';
import reviewTypeDefs from './reviews.js'; 

const rootTypeDefs = `#graphql
  scalar Date

  ${userTypeDefs} 
  ${gameTypeDefs}
  ${categoryTypeDefs}
  ${reviewTypeDefs}


  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export default rootTypeDefs;