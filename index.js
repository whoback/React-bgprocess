const express = require("express");
const cors = require("cors");

const { createServer } = require("http");
const { ApolloServer, gql, PubSub } = require("apollo-server-express");

const { runProcess } = require("./process.js");
const PORT = 4000;

const app = express();
app.use(cors());
const pubsub = new PubSub();

const EVENT_CREATED = "EVENT_CREATED";

const typeDefs = gql`
    type Query {
        run: Event
        r: String
    }
    type Subscription {
        eventCreated: Event
    }

    type Event {
        id: String
        content: String
        type: String
        status: String
        time: String
    }
`;

const resolvers = {
    Query: {
        r: () => {
            return;
        }
    },

    Subscription: {
        eventCreated: {
            subscribe: () => pubsub.asyncIterator(EVENT_CREATED)
        }
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers
});

app.get("/", (req, res) => {
    res.send("home");
});
app.get("/run", (req, res) => {
    runProcess(pubsub, EVENT_CREATED);
    res.send("request sent");
});

server.applyMiddleware({ app });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
    console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
    );
});
