if (typeof SharedArrayBuffer === 'undefined') {
  global.SharedArrayBuffer = undefined;
}

if (typeof DebuggerInternal === 'undefined') {
  global.DebuggerInternal = undefined;
}

if (typeof setTimeout === 'undefined') {
  global.setTimeout = undefined;
}

if (typeof nativeFabricUIManager === 'undefined') {
  global.nativeFabricUIManager = undefined;
}

if (typeof clearTimeout === 'undefined') {
  global.clearTimeout = undefined;
}

if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
  global.__REACT_DEVTOOLS_GLOBAL_HOOK__ = undefined;
}

if (typeof setImmediate === 'undefined') {
  global.setImmediate = undefined;
}

if (typeof fetch === 'undefined') {
  global.fetch = undefined;
}

if (typeof Headers === 'undefined') {
  global.Headers = undefined;
}

if (typeof Request === 'undefined') {
  global.Request = undefined;
}

if (typeof Response === 'undefined') {
  global.Response = undefined;
}

if (typeof FileReader === 'undefined') {
  global.FileReader = undefined;
}

if (typeof Blob === 'undefined') {
  global.Blob = undefined;
}

if (typeof FormData === 'undefined') {
  global.FormData = undefined;
}

if (typeof URLSearchParams === 'undefined') {
  global.URLSearchParams = undefined;
}

if (typeof AbortController === 'undefined') {
  global.AbortController = undefined;
}

if (typeof XMLHttpRequest === 'undefined') {
  global.XMLHttpRequest = undefined;
}

if (typeof self === 'undefined') {
  global.self = undefined;
}

if (typeof performance === 'undefined') {
  global.performance = undefined;
}

if (typeof navigator === 'undefined') {
  global.navigator = undefined;
}

if (typeof MessageChannel === 'undefined') {
  global.MessageChannel = undefined;
}

if (typeof nativeRuntimeScheduler === 'undefined') {
  global.nativeRuntimeScheduler = undefined;
}

if (typeof requestAnimationFrame === 'undefined') {
  global.requestAnimationFrame = undefined;
}




import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import HomePage from "./App/screens/homepage";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from '@expo/vector-icons/Feather';
import SettingsPage from "./App/screens/settingspage";
import { createStackNavigator } from '@react-navigation/stack';



import {
  useFonts,
  Poppins_400Regular,
  Poppins_100Thin,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_900Black,



} from '@expo-google-fonts/poppins';
import SuccessScreen from "./App/screens/SuccessScreen";

const logoImage = require("./assets/round.png");

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {


  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_100Thin,
    // Poppins_100ExtraLight ,
    // Poppins_100Light,
    Poppins_500Medium,
    // Poppins_600SemiBold,
    Poppins_700Bold,
    // Poppins_800ExtraBold,
    Poppins_900Black,
  });

  const TabNavigator = () => (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: "#701F21",
      tabBarLabelStyle: {
        fontSize: 12,
        paddingBottom: 4,
      },
      headerTitleStyle: {
        fontSize: 14,
        letterSpacing: 0.9,
        fontFamily: 'Poppins_500Medium',
      },
      headerStyle: {
        backgroundColor: "#FFF7F0",
        shadowColor: '#000',
        shadowOffset: { width: 1.5, height: 1.5 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 6,
      },
      tabBarStyle: {
        height: 60,
      },
    }}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
          headerShown: false,

        }}

      />

      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          tabBarIcon: ({ color }) => <Feather name="settings" size={22} color={color} />
        }}
      />
    </Tab.Navigator>
  );

  const StackNavigator = () => (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerTintColor: "#000000",
        headerTitle: "",
        headerTransparent: true,
        headerLeftContainerStyle: {
          paddingLeft: 0,
        },
      }}
    >
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerLeft: () => null }}
      />

      <Stack.Screen name="Success" component={SuccessScreen} />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
