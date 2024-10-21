import React, { useEffect } from "react";
import { Button, Text, View, Alert } from "react-native";
// import {
//   getAuth,
//   signInWithCredential,
//   GoogleAuthProvider,
// } from "firebase/auth";
// import { useAuthRequest } from "expo-auth-session";
// import * as WebBrowser from "expo-web-browser";

// Initialize WebBrowser
// WebBrowser.maybeCompleteAuthSession();

const SettingsPage = () => {
  // Define the Google Sign-In request
  // const [request, response, promptAsync] = useAuthRequest({
  //   clientId: "YOUR_FIREBASE_WEB_CLIENT_ID.apps.googleusercontent.com", // Use your Firebase web client ID here
  //   redirectUri: AuthSession.makeRedirectUri(),
  //   scopes: ["profile", "email"],
  //   usePKCE: false,
  // });

  // useEffect(() => {
  //   // Check if the response is successful
  //   if (response?.type === "success") {
  //     const { authentication } = response; // Get the authentication object
  //     const auth = getAuth(); // Get the Firebase auth instance
  //     const credential = GoogleAuthProvider.credential(authentication.id_token); // Create a credential from the token

  //     // Sign in with the credential
  //     signInWithCredential(auth, credential)
  //       .then((userCredential) => {
  //         // Signed in successfully
  //         const user = userCredential.user;
  //         Alert.alert("Logged in", `Welcome ${user.displayName}`); // Display welcome message
  //       })
  //       .catch((error) => {
  //         // Handle errors
  //         console.error(error);
  //         Alert.alert("Error", error.message);
  //       });
  //   }
  // }, [response]); // Effect runs whenever the response changes

  return (
    <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 16 }}>
      {/* <Button
        disabled={!request} // Disable button if the request is not ready
        title="Login with Google" // Button title
        onPress={() => {
          promptAsync(); // Trigger the authentication flow
        }}
      /> */}
      {/* Optionally, show a message or loading indicator while authenticating */}
      {/* {response?.type === "pending" && <Text>Loading...</Text>} */}
    </View>
  );
};

export default SettingsPage;
