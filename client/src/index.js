import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-common";
import { ApolloProvider as LegacyApolloProvider } from "react-apollo";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
  gql
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

import { WebSocketLink } from "@apollo/link-ws";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import ReactNotifications from "react-notifications-component";
import EventWrapper from "./EventsWrapper";
import "bootstrap/dist/css/bootstrap.min.css";

import "./index.css";
// import App from "./App";
import * as serviceWorker from "./serviceWorker";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true
  }
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

const App = () => (
  <ApolloProvider client={client}>
    <LegacyApolloProvider client={client}>
      <Container>
        <Row>
          <ReactNotifications />
          <div id="ren">
            <h2>Take Home 🚀</h2>

            <EventWrapper />
          </div>
        </Row>
      </Container>
    </LegacyApolloProvider>
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
