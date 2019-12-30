import React, { Suspense } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { ApolloProvider } from "react-apollo-hooks";
import client from "./apollo";
import Chat from "./Chat";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Chat />
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
