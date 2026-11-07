import { ApolloServer } from "@apollo/server";
import typeDefs from './graphql/schemas/index.js';
import resolvers from './graphql/resolvers/index.js'
import express from 'express'
import { expressMiddleware } from "@apollo/server/express4";
import {mongoose} from 'mongoose'
import cors from 'cors';
import dotenv from 'dotenv';
import payments from './payments.js';

dotenv.config();
const app = express();
const connectionString = process.env.MONGO_URI;

const startServer = async () => {
    try {
        await mongoose.connect(connectionString);
        console.log("MongoDB connected..");

        const server = new ApolloServer({
            typeDefs,
            resolvers
        });
        const port = Number.parseInt(process.env.PORT) || 4000;

        await server.start();
        app.use(cors());
        app.use(express.json());
        app.use('/api/graphql', express.json(), expressMiddleware(server))
        app.use('/payments', payments);

        app.listen(port, () => {
            console.log(`Server on port 4000, graphql at http://localhost:4000/api/graphql`)
        })
    }
    catch (error) {
        console.log("An error occured")
        console.log(error);
    }
} 

startServer();