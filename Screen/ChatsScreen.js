import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../userContext";
import { useNavigation } from "@react-navigation/native";
import UserChat from "../components/UserChat";


export default function ChatsScreen()
{
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const { userId, setUserId } = useContext(UserType);
    const navigation = useNavigation();

    useEffect(() =>
    {
        const acceptedFriendsList = async () =>
        {
            try
            {
                const response = await fetch(
                    `http://192.168.1.36:8000/accepted-friends/${userId}`
                );
                const data = await response.json();

                if (response.ok)
                {
                    setAcceptedFriends(data);
                }
            } catch (error)
            {
                console.log("error showing the accepted friends", error);
            }
        };

        acceptedFriendsList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    console.log("friends", acceptedFriends);
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Pressable>
                {acceptedFriends.map((item, index) => (
                    <UserChat key={index} item={item} />
                ))}
            </Pressable>
        </ScrollView>
    );
}
