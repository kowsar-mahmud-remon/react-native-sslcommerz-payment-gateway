import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const SuccessScreen = ({ navigation }) => {
  const handleContinue = () => {
    // Navigate back to the home screen or any other desired screen
    navigation.navigate("Home"); // Change 'Home' to your desired route
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.message}>Thank you for your payment.</Text>
      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default SuccessScreen;
