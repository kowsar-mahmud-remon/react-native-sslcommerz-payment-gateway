import React from "react";
import { View } from "react-native";
import Chat from "../components/Chat";
import ChatInput from "../components/ChatInput";

const ChatScreen = () => {
  // You can swap this value between 'staticUserId' and 'staticAdminId' based on the current user (for testing)
  const currentUserId = "FwUepETTS4dK18FEgpNVVUZ1OJN2"; // Replace with your static UID for testing

  return (
    <View style={{ flex: 1 }}>
      <Chat currentUserId={currentUserId} />
      <ChatInput currentUserId={currentUserId} />
    </View>
  );
};

export default ChatScreen;
