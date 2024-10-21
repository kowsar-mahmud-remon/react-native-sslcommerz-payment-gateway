import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../components/firebase"; // Assuming Firebase is initialized in 'firebase.js'

// Static admin user data
const admin = {
  uid: "0cewruh5nIPxBlFKtYMc2EeEf6h1", // Static UID
  displayName: "Kowsar Mahmud Remon", // Static display name
};

const AdminChatTwo = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch all conversations (admin-side)
  useEffect(() => {
    const loadConversations = async () => {
      const conversationsRef = collection(db, "conversations");
      const querySnapshot = await getDocs(conversationsRef);

      const conversationsData = [];
      querySnapshot.forEach((doc) => {
        conversationsData.push({ id: doc.id, ...doc.data() });
      });
      setConversations(conversationsData);
    };

    loadConversations();
  }, []);

  // Load selected conversation's messages
  useEffect(() => {
    if (!selectedConversationId) return;

    const conversationRef = doc(db, "conversations", selectedConversationId);
    const unsubscribe = onSnapshot(conversationRef, (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages || []);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [selectedConversationId]);

  // Admin sends a reply to the selected user conversation
  const sendAdminReply = async () => {
    if (!selectedConversationId || newMessage.trim() === "") return;

    const newMessageData = {
      senderId: admin.uid,
      senderName: admin.displayName,
      text: newMessage,
      time: Timestamp.now(), // Add the actual timestamp here
    };

    try {
      const conversationRef = doc(db, "conversations", selectedConversationId);
      const conversationSnapshot = await getDoc(conversationRef);

      if (conversationSnapshot.exists()) {
        const conversationData = conversationSnapshot.data();
        const updatedMessages = [...conversationData.messages, newMessageData];

        await updateDoc(conversationRef, {
          messages: updatedMessages,
          lastMessageTimestamp: serverTimestamp(),
        });

        console.log("Message sent with actual timestamp");
      } else {
        await updateDoc(conversationRef, {
          messages: arrayUnion(newMessageData),
          lastMessageTimestamp: serverTimestamp(),
        });

        console.log("Conversation created and message sent");
      }

      setNewMessage(""); // Clear the input field after sending the message
    } catch (error) {
      console.error("Error sending admin reply: ", error);
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
      <Text style={styles.header}>Admin Chat</Text>
      {/* remove ScrollView */}
      <ScrollView>
        <View style={styles.flexRow}>
          {/* Conversations list */}
          <View style={styles.conversationList}>
            <Text>Select a User Conversation</Text>
            {conversations.length === 0 ? (
              <Text>No conversations found</Text>
            ) : (
              <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.conversationItem}
                    onPress={() => setSelectedConversationId(item.id)}
                  >
                    <Text>Conversation with User ID: {item.id}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          {/* Messages for selected conversation */}
          {selectedConversationId && (
            <View style={styles.messageSection}>
              <Text style={styles.subHeader}>Conversation Messages</Text>
              <View style={styles.messageContainer}>
                {messages.length === 0 ? (
                  <Text>No messages in this conversation yet</Text>
                ) : (
                  <FlatList
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.messageItem}>
                        <Text style={styles.senderName}>
                          {item.senderName}:{" "}
                        </Text>
                        <Text>{item.text}</Text>
                        <Text style={styles.timestamp}>
                          {formatTime(item.time)}
                        </Text>
                      </View>
                    )}
                  />
                )}
              </View>
              <TextInput
                style={styles.input}
                value={newMessage}
                onChangeText={(text) => setNewMessage(text)}
                placeholder="Type a message..."
              />
              <Button title="Send" onPress={sendAdminReply} />
            </View>
          )}
        </View>
      </ScrollView>
      {/* remove ScrollView */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    height: 1000,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  conversationList: {
    width: "40%",
    padding: 10,
  },
  conversationItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  messageSection: {
    width: "55%",
    padding: 10,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
  },
  messageContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  messageItem: {
    marginBottom: 10,
  },
  senderName: {
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
  input: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default AdminChatTwo;
