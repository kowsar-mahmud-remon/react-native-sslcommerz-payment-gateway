import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  collection,
  getDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "../components/firebase"; // Assuming this is your Firebase setup file

// Static user data
const user = {
  uid: "FDZiZ9hWs5Q7sRKtOHyJxRtRWfz2", // Static UID
  displayName: "Mahmud", // Static display name
};

export default function UserChatThree() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const conversationId = user.uid; // Using static UID for the conversation

  // Fetch messages in real-time using Firestore's onSnapshot
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "conversations", conversationId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setMessages(docSnapshot.data().messages || []);
        } else {
          console.error("Conversation does not exist.");
        }
      },
      (error) => {
        console.error("Error fetching messages: ", error);
      }
    );

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, [conversationId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      senderId: user.uid,
      senderName: user.displayName,
      text: newMessage,
      time: Timestamp.now(), // Add the actual timestamp here
    };

    try {
      const conversationRef = doc(db, "conversations", conversationId);

      // Get the current conversation data (if it exists)
      const conversationSnapshot = await getDoc(conversationRef);

      if (conversationSnapshot.exists()) {
        // If the conversation exists, append the new message to the array
        const conversationData = conversationSnapshot.data();
        const updatedMessages = [...conversationData.messages, messageData];

        await updateDoc(conversationRef, {
          messages: updatedMessages,
          lastMessageTimestamp: serverTimestamp(),
        });

        console.log("Message sent with actual timestamp");
      } else {
        // If the conversation doesn't exist, create a new one
        await updateDoc(conversationRef, {
          messages: arrayUnion(messageData),
          lastMessageTimestamp: serverTimestamp(),
        });

        console.log("Conversation created and message sent");
      }

      setNewMessage(""); // Clear the input after sending
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const formatTime = (timestamp) => {
    if (timestamp) {
      const date = new Date(timestamp.seconds * 1000); // Convert Firestore Timestamp to JavaScript Date
      const formattedDate = date.toLocaleDateString(); // Format date (e.g., 10/06/2024)
      const formattedTime = date.toLocaleTimeString(); // Format time (e.g., 3:45 PM)
      return `${formattedDate} ${formattedTime}`; // Combine both date and time
    }
    return "";
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messageContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={styles.message}>
            <Text>
              <Text style={styles.senderName}>{msg.senderName}: </Text>
              {msg.text}
            </Text>
            <Text style={styles.timestamp}>{formatTime(msg.time)}</Text>
          </View>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type your message"
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    justifyContent: "center",
  },
  messageContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  senderName: {
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
