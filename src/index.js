const { GraphQLServer } = require("graphql-yoga");

let links = [{ id: "link-0", url: "jasonsun.org", description: "Author website" }];
let idCount = links.length;

const resolvers = {
    Query: {
        info: () => `This is the API of Hackerclonenews`,
        feed: () => links
    },
    Link: {
        id: root => root.id,
        description: root => root.description,
        url: root => root.url
    },
    Mutation: {
        updateLink: (root, args) => {
            const numericalId = args.id.split("-").slice(-1)[0];
            if (numericalId < idCount) {
                const link = { id: `link-${idCount++}`, description: args.description, url: args.url };
                links[numericalId] = link;
                return link;
            } else {
                return null;
            }
        },
        deleteLink: (root, args) => {
            const numericalId = args.id.split("-").slice(-1)[0];
            if (numericalId < idCount) {
                const link = links[numericalId];
                links.splice(numericalId, 1);
                return link;
            } else {
                return null;
            }
        },
        post: (root, args) => {
            const link = { id: `link-${idCount++}`, description: args.description, url: args.url };
            links.push(link);
            return link;
        }
    }
};

const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers
});

server.start(() => console.log(`Server running http://localhost:4000`));
