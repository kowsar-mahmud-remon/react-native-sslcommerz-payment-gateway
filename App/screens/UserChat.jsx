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
  addDoc,
  getDoc,
  setDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../components/firebase"; // Assuming this is your Firebase setup file

// Static user information
const user = {
  uid: "FDZiZ9hWs5Q7sRKtOHyJxRtRWfz2",
  displayName: "Mahmud",
};

export default function UserChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const conversationId = user.uid; // Static conversationId based on the user's UID

  // Fetch messages in real-time using Firestore's onSnapshot
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "conversations", conversationId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setMessages(docSnapshot.data().messages || []);
          console.log("user message", docSnapshot.data().messages);
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
        const existingMessages = conversationData.messages || [];

        // Add the new message to the array
        const updatedMessages = [...existingMessages, messageData];
        await updateDoc(conversationRef, {
          messages: updatedMessages,
          lastMessageTimestamp: serverTimestamp(),
        });

        console.log("Message sent with actual timestamp");
      } else {
        // If the conversation doesn't exist, create a new one
        await setDoc(conversationRef, {
          messages: [messageData], // Start with the new message
          lastMessageTimestamp: serverTimestamp(), // Set the last message timestamp
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
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={styles.message}>
            <Text style={styles.senderName}>{msg.senderName}:</Text>
            <Text>{msg.text}</Text>
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
    padding: 20,
    justifyContent: "center",
  },
  messagesContainer: {
    marginBottom: 20,
  },
  message: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  senderName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, Button, FlatList } from "react-native";
// import {
//   collection,
//   doc,
//   updateDoc,
//   onSnapshot,
//   arrayUnion,
// } from "firebase/firestore";
// import { db } from "../components/firebase"; // Import your Firebase config

// const UserChat = () => {
//   const [newMessage, setNewMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   const user = {
//     uid: "FwUepETTS4dK18FEgpNVVUZ1OJN2",
//     displayName: "prince forad",
//   };

//   useEffect(() => {
//     const conversationId = user.uid;
//     const unsubscribe = onSnapshot(
//       doc(db, "conversations", conversationId),
//       (docSnapshot) => {
//         if (docSnapshot.exists()) {
//           setMessages(docSnapshot.data().messages);
//         }
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   const sendMessage = async () => {
//     if (newMessage.trim()) {
//       const conversationId = user.uid;
//       const messageData = {
//         senderId: user.uid,
//         senderName: user.displayName,
//         text: newMessage,
//         time: new Date(),
//       };

//       await updateDoc(doc(db, "conversations", conversationId), {
//         messages: arrayUnion(messageData),
//       });
//       setNewMessage(""); // Clear the input after sending the message
//     }
//   };

//   return (
//     <View>
//       <FlatList
//         data={messages}
//         renderItem={({ item }) => (
//           <Text>
//             {item.senderName}: {item.text}
//           </Text>
//         )}
//         keyExtractor={(item, index) => index.toString()}
//       />
//       <TextInput
//         placeholder="Type your message"
//         value={newMessage}
//         onChangeText={setNewMessage}
//       />
//       <Button title="Send" onPress={sendMessage} />
//     </View>
//   );
// };

// export default UserChat;

// import React, { useState, useEffect } from "react";
// import { View, Text, TextInput, Button, ScrollView } from "react-native";
// import { doc, onSnapshot, updateDoc, Timestamp } from "firebase/firestore";
// import { db, auth } from "../components/firebase"; // Adjust the path

// const UserChat = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const user = auth.currentUser;
//   const conversationId = user.uid;
//   console.log("User", user);
//   console.warn("User", user);

//   useEffect(() => {
//     const unsubscribe = onSnapshot(
//       doc(db, "conversations", conversationId),
//       (docSnapshot) => {
//         if (docSnapshot.exists()) {
//           setMessages(docSnapshot.data().messages || []);
//         } else {
//           console.log("No conversation found");
//         }
//       }
//     );

//     return () => unsubscribe();
//   }, [conversationId]);

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;

//     const messageData = {
//       senderId: user.uid,
//       senderName: user.displayName,
//       text: newMessage,
//       time: Timestamp.now(),
//     };

//     const conversationRef = doc(db, "conversations", conversationId);
//     const updatedMessages = [...messages, messageData];

//     await updateDoc(conversationRef, { messages: updatedMessages });
//     setNewMessage("");
//   };

//   return (
//     <View>
//       <ScrollView>
//         {messages.map((msg, index) => (
//           <View key={index}>
//             <Text>
//               {msg.senderName}: {msg.text}
//             </Text>
//             <Text>
//               {new Date(msg.time.seconds * 1000).toLocaleTimeString()}
//             </Text>
//           </View>
//         ))}
//       </ScrollView>
//       <TextInput
//         value={newMessage}
//         onChangeText={setNewMessage}
//         placeholder="Type a message"
//       />
//       <Button title="Send" onPress={sendMessage} />
//     </View>
//   );
// };

// export default UserChat;
