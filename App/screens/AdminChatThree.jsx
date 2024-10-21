import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
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
} from "@react-native-firebase/firestore";
import { db, storage } from "../components/firebase"; // Ensure Firebase storage is imported
import * as DocumentPicker from "expo-document-picker"; // For file picking in React Native
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "@react-native-firebase/storage"; // Firebase storage utilities

const admin = {
  uid: "0cewruh5nIPxBlFKtYMc2EeEf6h1",
  displayName: "Kowsar Mahmud Remon",
};

const AdminChatThree = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null); // State for file upload

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

  const sendAdminReply = async (fileUrl = null) => {
    if (newMessage.trim() === "" && !fileUrl) return; // Don't send if there's no message or file

    const newMessageData = {
      senderId: admin.uid,
      senderName: admin.displayName,
      text: newMessage || (fileUrl ? "Sent an image/file" : ""),
      fileUrl: fileUrl || null, // Include file URL if available
      time: Timestamp.now(),
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
      } else {
        await updateDoc(conversationRef, {
          messages: arrayUnion(newMessageData),
          lastMessageTimestamp: serverTimestamp(),
        });
      }

      setNewMessage(""); // Clear message input
      setFile(null); // Clear file after sending
    } catch (error) {
      console.error("Error sending admin reply: ", error);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      // If there's no file, just send the message
      await sendAdminReply();
      return;
    }

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(
          "Uploading: ",
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      },
      (error) => {
        console.error("Upload error: ", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await sendAdminReply(downloadURL); // Send message with file URL
      }
    );
  };

  const handlePickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    if (result.type === "success") {
      setFile(result);
    }
  };

  const formatTime = (timestamp) => {
    if (timestamp) {
      const date = new Date(timestamp.seconds * 1000);
      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString();
      return `${formattedDate} ${formattedTime}`;
    }
    return "";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Chat</Text>
      <View style={styles.flexRow}>
        <View style={styles.conversationList}>
          <Text style={styles.subheading}>Select a User Conversation</Text>
          {conversations.length === 0 ? (
            <Text>No conversations found</Text>
          ) : (
            <ScrollView>
              {conversations.map((conversation) => (
                <TouchableOpacity
                  style={styles.conversationItem}
                  key={conversation.id}
                  onPress={() => setSelectedConversationId(conversation.id)}
                >
                  <Text>Conversation with User ID: {conversation.id}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {selectedConversationId && (
          <View style={styles.messageArea}>
            <Text style={styles.subheading}>Conversation Messages</Text>
            <ScrollView style={styles.messageContainer}>
              {messages.length === 0 ? (
                <Text>No messages in this conversation yet</Text>
              ) : (
                messages.map((message, index) => (
                  <View key={index} style={styles.message}>
                    <Text style={styles.senderName}>
                      {message.senderName}: {message.text}
                    </Text>
                    {message.fileUrl && (
                      <Text onPress={() => Linking.openURL(message.fileUrl)}>
                        View File
                      </Text>
                    )}
                    <Text style={styles.timestamp}>
                      {formatTime(message.time)}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
            />
            <Button title="Pick File" onPress={handlePickFile} />
            <Button title="Send" onPress={handleFileUpload} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  heading: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 20,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  conversationList: {
    width: "40%",
  },
  conversationItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  messageArea: {
    width: "55%",
  },
  messageContainer: {
    maxHeight: 400,
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

export default AdminChatThree;
