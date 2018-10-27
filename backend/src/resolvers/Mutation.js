const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

// function updateLink(root, args, context, info) {
//     return context.db.updateLink(
//         {
//             data: {
//                 description: args.description,
//                 url: args.url
//             }
//         },
//         { where: { id: args.id } }
//     );
// }
// function deleteLink(root, args, context, info) {
//     return context.db.deleteLink({ where: { id: args.id } });
// }
function post(parent, args, context, info) {
    // we need a user
    const userId = getUserId(context);
    return context.db.mutation.createLink(
        {
            data: {
                url: args.url,
                description: args.description,
                postedBy: { connect: { id: userId } }
            }
        },
        info
    );
}

async function signup(parent, args, context, info) {
    // 1
    const password = await bcrypt.hash(args.password, 10);
    // 2
    const user = await context.db.mutation.createUser(
        {
            data: { ...args, password }
        },
        `{ id }`
    );

    // 3
    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    // 4
    return {
        token,
        user
    };
}

async function login(parent, args, context, info) {
    // 1
    const user = await context.db.query.user({ where: { email: args.email } }, ` { id password } `);
    if (!user) {
        throw new Error("No such user found");
    }

    // 2
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    // 3
    return {
        token,
        user
    };
}

async function vote(parent, args, context, info) {
    // 1 need a user
    const userId = getUserId(context);

    // 2 check if we've voted
    const linkExists = await context.db.exists.Vote({
        user: { id: userId },
        link: { id: args.linkId }
    });
    if (linkExists) {
        throw new Error(`Already voted for link: ${args.linkId}`);
    }

    // 3 create a vote
    return context.db.mutation.createVote(
        {
            data: {
                user: {
                    connect: { id: userId }
                },
                link: { connect: { id: args.linkId } }
            }
        },
        info
    );
}

module.exports = {
    signup,
    login,
    post,
    vote
};
