import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../Screen/Login.js";
import RegisterScreen from "../Screen/Register.js";
import Home from "../Screen/Home.js";
import FriendScreen from "../Screen/FriendScreen.js";
import ChatsScreen from "../Screen/ChatsScreen.js";
import ChatMessagesScreen from "../Screen/ChatMessagesScreen.js";

export default function Navigator()
{

    const Stack = createNativeStackNavigator();
    return (

        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Friends" component={FriendScreen} />
                <Stack.Screen name="Chats" component={ChatsScreen} />
                <Stack.Screen name="Messages" component={ChatMessagesScreen} />
            </Stack.Navigator>

        </NavigationContainer>
    );
}