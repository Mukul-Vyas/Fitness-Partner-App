import { View, Text, Image, Dimensions, Animated, Pressable } from "react-native";
import React, { useCallback, useContext, useState, useEffect } from 'react';
import LinearGradient from "react-native-linear-gradient";
import CardChoice from "./CardChoice";
import { UserType } from "../userContext";
const { height, width } = Dimensions.get('window');

export default function SwipeCard({ item, isFirst, swipe, ...rest })
{

    const { userId, setUserId } = useContext(UserType);
    const [requestSent, setRequestSent] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]);
    const [userFriends, setUserFriends] = useState([]);

    useEffect(() =>
    {
        const fetchFriendRequests = async () =>
        {
            try
            {
                const response = await fetch(
                    `http://192.168.1.36:8000/friend-requests/sent/${userId}`
                );

                const data = await response.json();
                if (response.ok)
                {
                    setFriendRequests(data);
                } else
                {
                    console.log("error", response.status);
                }
            } catch (error)
            {
                console.log("error", error);
            }
        };

        fetchFriendRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() =>
    {
        const fetchUserFriends = async () =>
        {
            try
            {
                const response = await fetch(`http://192.168.1.36:8000/friends/${userId}`);

                const data = await response.json();

                if (response.ok)
                {
                    setUserFriends(data);
                } else
                {
                    console.log("error retrieving user friends", response.status);
                }
            } catch (error)
            {
                console.log("Error message", error);
            }
        };

        fetchUserFriends();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sendFriendRequest = async (currentUserId, selectedUserId) =>
    {
        try
        {
            const response = await fetch("http://192.168.1.36:8000/friend-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ currentUserId, selectedUserId }),
            });

            if (response.ok)
            {
                setRequestSent(true);
            }
        } catch (error)
        {
            console.log("error message", error);
        }
    };
    console.log("friend requests sent", friendRequests);
    console.log("user friends", userFriends);




    const Rotate = swipe.x.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: ['-8deg', '0deg', '8deg'],

    });

    const likeOpacity = swipe.x.interpolate({
        inputRange: [10, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const NopeOpacity = swipe.x.interpolate({
        inputRange: [-100, -10],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const cardSelection = useCallback(() =>
    {

        return (
            <>

                <Animated.View style={{ position: 'absolute', top: 60, right: 20, opacity: NopeOpacity, transform: [{ rotate: '30deg' }] }}>
                    <CardChoice type={'Nope'} />
                </Animated.View>
                <Animated.View style={{ position: 'absolute', top: 60, left: 20, opacity: likeOpacity, transform: [{ rotate: '-30deg' }] }} >
                    <CardChoice type={'Like'} />
                </Animated.View>

            </>
        )

    }, [NopeOpacity, likeOpacity]);

    return (
        <Animated.View style={[{ width: width - 20, height: height - 280, alignSelf: 'center', position: 'absolute', top: 40, borderRadius: 10 }, isFirst && { transform: [...swipe.getTranslateTransform(), { rotate: Rotate }] }]}{...rest}  >
            <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />

            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={{ width: '100%', height: '100%', borderRadius: 10, position: 'absolute' }} >
                <Text style={{ color: '#fff', position: 'absolute', bottom: 20, left: 20, fontSize: 40 }}>{item.name}</Text>
            </LinearGradient>

            {
                isFirst && cardSelection()
            }

            {/* <Pressable style={{ backgroundColor: "#567189", padding: 10, borderRadius: 6, width: 150, marginRight: 'auto', marginLeft: 'auto', marginTop: 25 }} >
                <Text style={{ textAlign: "center", color: 'white', fontSize: 13 }}>Add Fitness Partner</Text>
            </Pressable> */}

            {userFriends.includes(item._id) ? (
                <Pressable
                    style={{
                        backgroundColor: "#82CD47",
                        padding: 10,
                        width: 105,
                        borderRadius: 6,
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        marginTop: 25,
                    }}
                >
                    <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
                </Pressable>
            ) : requestSent || friendRequests.some((friend) => friend._id === item._id) ? (
                <Pressable
                    style={{
                        backgroundColor: "gray",
                        padding: 10,
                        width: 105,
                        borderRadius: 6,
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        marginTop: 25,
                    }}
                >
                    <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
                        Request Sent
                    </Text>
                </Pressable>
            ) : (
                <Pressable
                    onPress={() => sendFriendRequest(userId, item._id)}
                    style={{
                        backgroundColor: "#567189",
                        padding: 10,
                        borderRadius: 6,
                        width: 105,
                        marginRight: 'auto',
                        marginLeft: 'auto',
                        marginTop: 25,
                    }}
                >
                    <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
                        Add Friend
                    </Text>
                </Pressable>
            )}


        </Animated.View>

    );
}
