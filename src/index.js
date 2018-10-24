const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require("prisma-binding");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const AuthPayload = require("./resolvers/AuthPayload");
const Subscription = require("./resolvers/Subscription");
const Feed = require('./resolvers/Feed')

const resolvers = {
    Query,
    AuthPayload,
    Mutation,
    Subscription,
    Feed
};

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: "src/generated/prisma.graphql",
            endpoint: "https://us1.prisma.sh/jason-sun-96aad0/database/dev",
            secret: "mysecret123",
            debug: true
        })
    })
});

server.start(() => console.log(`Server running http://localhost:4000`));
