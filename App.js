import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from 'expo-linking';
import HomePage from "./App/screens/homepage";
import SuccessScreen from "./App/screens/SuccessScreen";
import SettingsPage from "./App/screens/settingspage";
import Feather from "@expo/vector-icons/Feather";
// import UserChat from "./App/screens/UserChat";
import AdminChat from "./App/screens/AdminChat";
// import ChatScreen from "./App/screens/ChatScreen";
import UserChat from "./App/screens/UserChat";
import UserChatThree from "./App/screens/UserChatThree";
import AdminChatThree from "./App/screens/AdminChatThree";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const linking = {
  prefixes: ['paymentapp://'],  // Your custom URL scheme
  config: {
    screens: {
      Success: 'success',  // Maps "paymentapp://success" to Success screen
    },
  },
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
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
        tabBarIcon: ({ color }) => <Feather name="settings" size={22} color={color} />,
      }}
    />
    <Tab.Screen
      name="User"
      component={UserChatThree}
      options={{
        tabBarIcon: ({ color }) => <Feather name="message-circle" size={22} color={color} />,
      }}
    />
    <Tab.Screen
      name="Admin"
      component={AdminChatThree}
      options={{
        tabBarIcon: ({ color }) => <Feather name="shield" size={22} color={color} />,
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

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <StackNavigator />
    </NavigationContainer>
  );
}
