import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
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
} from "firebase/firestore";
import { db, storage } from "../components/firebase"; // Ensure Firebase storage is imported
import * as DocumentPicker from "expo-document-picker"; // For file upload
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

  const [filePreview, setFilePreview] = useState(null);

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
      setFilePreview(null);
    } catch (error) {
      console.error("Error sending admin reply: ", error);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      // If there's no file, just send the message
      console.log("No file selected, sending message only");
      await sendAdminReply();
      return;
    }

    try {
      console.log("Uploading file:", file);

      const response = await fetch(file.uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(
            "Uploading: ",
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            "% done"
          );
        },
        (error) => {
          console.error("Upload error: ", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File uploaded successfully. File URL:", downloadURL);
          await sendAdminReply(downloadURL); // Send message with file URL
        }
      );
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];

        setFile({
          uri: pickedFile.uri,
          name: pickedFile.name || "file",
          type: pickedFile.mimeType || "application/octet-stream",
        });

        // If it's an image, set the preview to display it, otherwise just show the file name

        if (pickedFile.mimeType && pickedFile.mimeType.startsWith("image/")) {
          setFilePreview({ type: "image", uri: pickedFile.uri });
        } else {
          setFilePreview({ type: "file", name: pickedFile.name });
        }

        console.log("File picked:", pickedFile);
      } else {
        console.error("File pick was not successful:", result);
      }
    } catch (error) {
      console.error("Error picking file:", error);
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
    <View style={{ padding: 20, flex: 1 }}>
      <Text style={{ textAlign: "center", fontSize: 24, marginBottom: 20 }}>
        Admin Chat
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View style={{ width: "40%" }}>
          <Text style={{ fontSize: 18 }}>Select a User Conversation</Text>
          {conversations.length === 0 ? (
            <Text>No conversations found</Text>
          ) : (
            <FlatList
              data={conversations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: "#ccc",
                    marginVertical: 5,
                    borderRadius: 5,
                  }}
                  onPress={() => setSelectedConversationId(item.id)}
                >
                  <Text>Conversation with User ID: {item.id}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {selectedConversationId && (
          <View style={{ width: "55%" }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>
              Conversation Messages
            </Text>
            <FlatList
              data={messages}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 15 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {item.senderName}: {item.text}
                  </Text>
                  {item.fileUrl && (
                    // <TouchableOpacity
                    //   onPress={() => Alert.alert("Open File", item.fileUrl)}
                    // >
                    //   <Text style={{ color: "blue" }}>View File</Text>
                    // </TouchableOpacity>

                    <Text onPress={() => Linking.openURL(item.fileUrl)}>
                      View File
                    </Text>
                  )}
                  <Text style={{ fontStyle: "italic", fontSize: 12 }}>
                    {formatTime(item.time)}
                  </Text>
                </View>
              )}
            />

            {filePreview && (
              <View style={styles.previewContainer}>
                {filePreview.type === "image" ? (
                  <Image
                    source={{ uri: filePreview.uri }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <Text style={styles.fileName}>
                    Selected File: {filePreview.name}
                  </Text>
                )}
              </View>
            )}

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                marginTop: 10,
              }}
              value={newMessage}
              onChangeText={(text) => setNewMessage(text)}
              placeholder="Type a message..."
            />
            <Button title="Pick File" onPress={pickDocument} />
            <Button title="Send" onPress={handleFileUpload} />
          </View>
        )}
      </View>
    </View>
  );
};

export default AdminChatThree;

const styles = StyleSheet.create({
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  fileName: {
    fontSize: 16,
    color: "black",
  },
});
