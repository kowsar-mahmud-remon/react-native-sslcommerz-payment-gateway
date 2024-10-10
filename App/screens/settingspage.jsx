import React, { useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_100Thin,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";

const SettingsPage = () => {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_100Thin,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_900Black,
  });

  return (
    <View style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 16 }}>
      <Text>This is Settings Page</Text>
    </View>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  image: {},
});
