import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import gql from "graphql-tag";
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks";
import withSuspense from "./withSuspense";

const GET_MESSAGE = gql`
  query messages {
    messages {
      id
      text
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($text: String!) {
    sendMessage(text: $text) {
      id
      text
    }
  }
`;

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      id
      text
    }
  }
`;

const Chat = () => {
  const [message, setMessage] = useState(""); // 작성된 메시지를 mutation 할때 사용
  const [sendMessagesMutation] = useMutation(SEND_MESSAGE, {
    variables: {
      text: message
    }
  });

  const {
    data: { messages: oldMessages },
    error
  } = useQuery(GET_MESSAGE, { suspend: true });

  const [messages, setMessages] = useState(oldMessages || []); //subscription시 사용

  const { data } = useSubscription(NEW_MESSAGE);

  const handleNewMessage = () => {
    if (data !== undefined) {
      const { newMessage } = data;
      setMessages(pre => [...pre, newMessage]);
    }
  };

  const onChangeText = text => setMessage(text);

  const onSubmit = async () => {
    if (message === "") {
      return;
    }
    try {
      await sendMessagesMutation();
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleNewMessage();
  }, [data]);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior="padding">
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 50,
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center"
        }}
      >
        {messages.map(m => (
          <View key={m.id} style={{ marginBottom: 10 }}>
            <Text>{m.text}</Text>
          </View>
        ))}
        <TextInput
          placeholder="Type a message"
          style={{
            marginTop: 50,
            width: "90%",
            borderRadius: 10,
            paddingVertical: 15,
            paddingHorizontal: 10,
            backgroundColor: "#f2f2f2"
          }}
          returnKeyType="send"
          value={message}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withSuspense(Chat);
