import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

const PaymentPage = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    customer_name: "",
    customer_email: "",
    customer_address: "",
    customer_phone: "",
    customer_city: "",
  });

  const [paymentUrl, setPaymentUrl] = useState(null); // Stores payment URL
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const navigation = useNavigation();

  const handleChange = (key, value) => {
    setPaymentDetails({ ...paymentDetails, [key]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    fetch("https://sslcommerz-payment.vercel.app/initiate-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentDetails),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        if (result.url) {
          setPaymentUrl(result.url); // Set payment URL to open in WebView
        } else {
          Alert.alert("Error", "Payment URL not received");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error initiating payment:", error);
        Alert.alert("Error", "Failed to initiate payment");
      });
  };

  if (paymentUrl) {
    return (
      <WebView
        source={{ uri: paymentUrl }}
        style={{ width: "100%", height: "100%" }}
        startInLoadingState={true} // Show loader while WebView is loading
        renderLoading={() => <ActivityIndicator size="large" color="#0000ff" />}
        javaScriptEnabled={true} // Enable JavaScript for the page
        domStorageEnabled={true} // Enable DOM storage for the payment page
        onNavigationStateChange={(event) => {
          console.log("Navigating to:", event.url); // Log URL changes
          console.log("event.url", event.url);

          if (event.url.includes("paymentapp")) {
            // Alert.alert("paymentapp");
            // setPaymentUrl(null);
            navigation.navigate("Success");
          } else if (event.url.includes("failure")) {
            Alert.alert("Payment Failed", "Your payment failed.");
            setPaymentUrl(null);
          }
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error: ", nativeEvent);
          Alert.alert("Error", "Failed to load the payment page");
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SSLCommerz Payment</Text>

      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={paymentDetails.amount}
        onChangeText={(value) => handleChange("amount", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={paymentDetails.customer_name}
        onChangeText={(value) => handleChange("customer_name", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Customer Email"
        keyboardType="email-address"
        value={paymentDetails.customer_email}
        onChangeText={(value) => handleChange("customer_email", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Customer Address"
        value={paymentDetails.customer_address}
        onChangeText={(value) => handleChange("customer_address", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Customer Phone"
        keyboardType="phone-pad"
        value={paymentDetails.customer_phone}
        onChangeText={(value) => handleChange("customer_phone", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Customer City"
        value={paymentDetails.customer_city}
        onChangeText={(value) => handleChange("customer_city", value)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Proceed to Payment" onPress={handleSubmit} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default PaymentPage;
