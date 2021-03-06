import express from "express";
import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import schedule from "node-schedule";
import sequelize from "./models";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import repeatTodo from "./helpFuncs/repeatTodo";

const PORT = 4000;
schedule.scheduleJob({ hour: 0, minute: 0 }, repeatTodo);

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();
sequelize.sequelize.sync();
server.applyMiddleware({ app });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});

// app.listen(PORT, () => {
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
// });
