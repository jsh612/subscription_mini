import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink, split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const httpLink = new HttpLink({
  // link는 아폴로가 데이터를 방는 방식
  uri: "http://localhost:4000"
});

const wsLink = new WebSocketLink({
  // link는 아폴로가 데이터를 방는 방식
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    split(
      // 명령문이 subscrion인지 아닌지에 따라 WsLink 와 httpLink 중 하나를 선택한다.
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
  ]),
  cache: new InMemoryCache()
});

export default client;
