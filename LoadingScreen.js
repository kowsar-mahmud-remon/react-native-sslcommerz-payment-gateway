import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated } from "react-native";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function LoadingScreen({ onFinish }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    SplashScreen.hideAsync();
    const startAnimation = () => {
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000, // Animation duration 5 seconds
        useNativeDriver: false,
      }).start(async () => {
        onFinish();
      });
    };

    startAnimation();
  }, []);

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Image source={require("./assets/leaf.png")} style={styles.logo} />
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[styles.progressBar, { width: progressBarWidth }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5EE",
  },
  logo: {
    width: 170,
    height: 170,
    resizeMode: "contain",
    marginBottom: 30,
  },
  progressBarContainer: {
    width: "80%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginTop: 60,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FB3640",
    borderRadius: 5,
  },
});
