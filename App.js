import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { ApolloProvider } from "react-apollo-hooks";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import client from "./apollo";
import Chat from "./Chat";

export default function App() {
  const [notifi, setNotifi] = useState(false);

  const ask = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    setNotifi(status);
    console.log(1);
    // # 토큰
    //  - 서버에 저장하여, 특정 디바이스를 식별하는데 사용한다.
    //  -https://docs.expo.io/versions/v36.0.0/guides/push-notifications/#1-save-the-users-expo-push-token
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token);
  };

  useEffect(() => {
    ask();
  }, []);

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
