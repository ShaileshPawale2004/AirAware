import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./pages/WelcomeScreen";
import LoginOrSignup from "./pages/LoginOrSignup";
import HomeScreen from "./pages/HomeScreen";
import Graph from "./pages/Graph";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginOrSignup"
          component={LoginOrSignup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="Graph"
          component={Graph}
          options={{ title: "Graph" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
