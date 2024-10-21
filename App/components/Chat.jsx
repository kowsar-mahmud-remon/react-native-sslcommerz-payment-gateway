import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';  // Importing Firebase config

const Chat = ({ currentUserId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'conversations', currentUserId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });

    return () => unsubscribe();  // Clean up the listener
  }, [currentUserId]);

  return (
    <ScrollView>
      {messages.map((message) => (
        <View key={message.id} style={{ padding: 10, backgroundColor: message.senderId === currentUserId ? '#dcf8c6' : '#fff' }}>
          <Text>{message.senderId === currentUserId ? 'Me' : 'Admin'}: {message.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default Chat;
