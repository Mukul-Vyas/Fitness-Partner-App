import { View, Text, Animated, PanResponder, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useLayoutEffect, useState, useContext } from 'react';
import { UserType } from "../userContext";
import SwipeCard from "../components/SwipeCard";
import { useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeartIcon from 'react-native-vector-icons/AntDesign';
import CrossIcon from 'react-native-vector-icons/Entypo';
import ChatIcon from 'react-native-vector-icons/Ionicons';
import PeopleIcon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import jwt_decode from "jwt-decode";
import axios from "axios";


export default function Home()
{

    const navigation = useNavigation();

    const { userId, setUserId } = useContext(UserType);
    const [users, setUsers] = useState([]);

    useEffect(() =>
    {

        const fetchUsers = async () =>
        {

            const token = await AsyncStorage.getItem("authtoken");

            const decodedToken = jwt_decode(token);

            // eslint-disable-next-line no-shadow
            const userId = decodedToken.userId;
            setUserId(userId);

            console.log(userId);

            axios.get(`http://192.168.1.36:8000/users/${userId}`).then((response) =>
            {
                setUsers(response.data);
                console.log("Its a success");
                console.log(response.data);
            }).catch((error) =>
            {
                console.log("error retrieving users", error);
            });

        }

        fetchUsers();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() =>
    {

        if (!users.length)
        {
            setUsers(users);
        }

    }, [users]);

    const swipe = useRef(new Animated.ValueXY()).current;
    const panResponser = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, { dx, dy }) =>
        {
            console.log("dx:" + dx + 'dy:' + dy);
            swipe.setValue({ x: dx, y: dy });
        },

        onPanResponderRelease: (_, { dx, dy }) =>
        {
            console.log("Realesed:" + 'dx:' + dx + 'dy:' + dy);

            let direction = Math.sign(dx);
            let isActionActive = Math.abs(dx) > 200;
            if (isActionActive)
            {

                Animated.timing(swipe, {
                    toValue: { x: 500 * dx, y: dy },
                    useNativeDriver: true,
                    duration: 500,
                }).start(removeCard);

            } else
            {

                Animated.spring(swipe, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                    Friction: 5,
                }).start();

            }


        },
    });

    const removeCard = useCallback(() =>
    {

        setUsers(prepState => prepState.slice(1));
        swipe.setValue({ x: 0, y: 0 });


    }, [swipe]);


    const handleSelection = useCallback((direction) =>
    {

        Animated.timing(swipe, {
            toValue: { x: direction * 500, y: 0 },
            useNativeDriver: true,
            duration: 500,
        }).start(removeCard);
    }, [removeCard, swipe]);


    useLayoutEffect(() =>
    {

        navigation.setOptions({
            headerTitle: "",
            // eslint-disable-next-line react/no-unstable-nested-components
            headerLeft: () =>
            (
                <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>Fitness Partner</Text>
            ),

            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () =>
            (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>

                    <ChatIcon onPress={() => navigation.navigate('Chats')} name="chatbox-ellipses-outline" size={25} color="black" />
                    <PeopleIcon onPress={() => navigation.navigate('Friends')} name="people-outline" size={25} color="black" />
                </View>
            ),
        });


    }, [navigation]);



    return (
        <View style={{ flex: 1 }}>
            {
                users.map((item, index) =>
                {
                    let isFirst = index === 0;
                    let dragHandlers = isFirst ? panResponser.panHandlers : {};
                    return <SwipeCard key={index} item={item} isFirst={isFirst} swipe={swipe} {...dragHandlers} />;
                }).reverse()
            }
            <View style={{ width: '100%', position: 'absolute', bottom: 20, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

                <TouchableOpacity onPress={() =>
                {
                    handleSelection(1);
                }} style={{ width: 60, height: 60, backgroundColor: '#fff', elevation: 5, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <HeartIcon name="hearto" size={30} color="black" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() =>
                {
                    handleSelection(-1);
                }} style={{ width: 60, height: 60, backgroundColor: '#fff', elevation: 5, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <CrossIcon name="cross" size={38} color="black" />
                </TouchableOpacity>

            </View>

        </View>
    );
};