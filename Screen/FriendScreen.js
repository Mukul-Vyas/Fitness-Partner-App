import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { UserType } from "../userContext";
import FriendRequest from "../components/FriendRequest";
export default function FriendScreen()
{
    const { userId, setUserId } = useContext(UserType);
    const [friendRequests, setFriendRequests] = useState([]);
    useEffect(() =>
    {
        fetchFriendRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchFriendRequests = async () =>
    {
        try
        {
            const response = await axios.get(
                `http://192.168.1.36:8000/friend-request/${userId}`
            );
            if (response.status === 200)
            {
                const friendRequestsData = response.data.map((friendRequest) => ({
                    _id: friendRequest._id,
                    name: friendRequest.name,
                    email: friendRequest.email,
                    image: friendRequest.image,

                }));

                setFriendRequests(friendRequestsData);
                console.log("friends api working");
            }
        } catch (err)
        {
            console.log("error message", err);
        }
    };

    console.log(friendRequests);
    return (
        <View style={{ padding: 10, marginHorizontal: 12 }}>
            {friendRequests.length > 0 && <Text style={{ color: 'black' }}>Your Friend Requests!</Text>}

            {friendRequests.map((item, index) => (
                <FriendRequest
                    key={index}
                    item={item}
                    friendRequests={friendRequests}
                    setFriendRequests={setFriendRequests}
                />
            ))}
        </View>
    );
}