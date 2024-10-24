import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Image, // Import Image for displaying image previews
  TouchableOpacity,
  Linking,
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
import { db, storage } from "../components/firebase";
import * as DocumentPicker from "expo-document-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const user = {
  uid: "FDZiZ9hWs5Q7sRKtOHyJxRtRWfz2",
  displayName: "Mahmud",
};

export default function UserChatThree() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null); // Correctly handle the file
  const [filePreview, setFilePreview] = useState(null); // State to display file preview
  const conversationId = user.uid;

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

    return () => unsubscribe();
  }, [conversationId]);

  const sendMessage = async (fileUrl = null) => {
    if (newMessage.trim() === "" && !fileUrl) return;

    const messageData = {
      senderId: user.uid,
      senderName: user.displayName,
      text: newMessage || (fileUrl ? "Sent an image/file" : ""),
      fileUrl: fileUrl || null,
      time: Timestamp.now(),
    };

    try {
      const conversationRef = doc(db, "conversations", conversationId);
      const conversationSnapshot = await getDoc(conversationRef);

      if (conversationSnapshot.exists()) {
        const conversationData = conversationSnapshot.data();
        const updatedMessages = [...conversationData.messages, messageData];

        await updateDoc(conversationRef, {
          messages: updatedMessages,
          lastMessageTimestamp: serverTimestamp(),
        });
      } else {
        await updateDoc(conversationRef, {
          messages: arrayUnion(messageData),
          lastMessageTimestamp: serverTimestamp(),
        });
      }

      setNewMessage("");
      setFile(null);
      setFilePreview(null); // Clear the file preview after sending
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      await sendMessage();
      return;
    }

    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

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
          await sendMessage(downloadURL); // Send the message with file URL
        }
      );
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handlePickFile = async () => {
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
    <View style={styles.container}>
      <ScrollView style={styles.messageContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={styles.message}>
            <Text style={styles.senderName}>
              {msg.senderName}: {msg.text}
            </Text>
            {msg.fileUrl && (
              <Text onPress={() => Linking.openURL(msg.fileUrl)}>
                View File
              </Text>
            )}
            <Text style={styles.timestamp}>{formatTime(msg.time)}</Text>
          </View>
        ))}
      </ScrollView>

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
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type your message"
      />
      <Button title="Pick File" onPress={handlePickFile} />
      <Button title="Send" onPress={handleFileUpload} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
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
  previewContainer: {
    marginBottom: 10,
  },
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
