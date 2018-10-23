const { GraphQLServer } = require("graphql-yoga");
const { Prisma } = require('prisma-binding')

const resolvers = {
    Query: {
        info: () => `This is the API of Hackerclonenews`,
        feed: (root, args, context, info) => {
            return context.db.query.links({}, info);
        }
    },
    Link: {
        id: root => root.id,
        description: root => root.description,
        url: root => root.url
    },
    Mutation: {
        updateLink: (root, args, context, info) => {
            return context.db.updateLink(
                {
                    data: {
                        description: args.description,
                        url: args.url
                    }
                },
                { where: { id: args.id } }
            );
        },
        deleteLink: (root, args, context, info) => {
            return context.db.deleteLink({ where: { id: args.id } });
        },
        post: (root, args, context, info) => {
            return context.db.mutation.createLink(
                {
                    data: {
                        url: args.url,
                        description: args.description
                    }
                },
                info
            );
        }
    }
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
