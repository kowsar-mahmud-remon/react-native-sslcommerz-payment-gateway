import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../components/firebase"; // Importing Firebase config

const ChatInput = ({ currentUserId }) => {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (message.trim() === "") return;

    try {
      await addDoc(collection(db, "conversations", currentUserId, "messages"), {
        text: message,
        senderId: currentUserId,
        timestamp: serverTimestamp(),
      });
      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <View>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default ChatInput;
