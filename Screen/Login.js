import { View, Text, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LockIcon from 'react-native-vector-icons/AntDesign'
import { TextInput } from "react-native";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function LoginScreen()
{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigation = useNavigation();


    // useEffect(() =>
    // {
    //     const checkLoginStatus = async () =>
    //     {
    //         try
    //         {
    //             const token = await AsyncStorage.getItem("authtoken");

    //             console.log("got the token", token);

    //             if (token)
    //             {
    //                 setTimeout(() =>
    //                 {
    //                     navigation.replace("Home");
    //                 }, 400);
    //             }
    //         } catch (error)
    //         {
    //             console.log("error", error);
    //         }
    //     };

    //     checkLoginStatus();

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);


    const handleLogin = () =>
    {


        const user = {
            email: email,
            password: password,
        };

        console.log(email);
        console.log(password);

        axios.post("http://192.168.1.36:8000/login", user).then((response) =>
        {

            console.log(response);

            const token = response.data.token;

            AsyncStorage.setItem("authtoken", token);

            navigation.navigate("Home");

            setEmail("");
            setPassword("");



        }).catch((error) =>
        {
            Alert.alert("login Error")
            console.log("Error login", error);
        });

    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: "center" }}>
            <View style={{ marginTop: 50 }}>
                <Image style={{ width: 150, height: 100, resizeMode: "contain" }} source={require("../assets/masculine.jpg")} />

            </View>

            <KeyboardAvoidingView>
                <View style={{ alignItems: "center", justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 20, color: 'black' }}>Login to Your Account</Text>
                </View>

                <View style={{ marginTop: 40 }}>
                    <View style={{ flexDirection: 'row', alignItems: "center", gap: 5, borderColor: '#D8D8D8', borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
                        <Icon style={{ marginLeft: 8 }} name="email" size={30} color="black" />
                        <TextInput placeholderTextColor={'grey'} style={{ color: 'gray', marginVertical: 1, width: 300, fontSize: email ? 16 : 16 }} placeholder="Enter your Email" value={email} onChangeText={(text) => setEmail(text)} />
                    </View>

                </View>

                <View style={{ marginTop: 30 }}>
                    <View style={{ flexDirection: 'row', alignItems: "center", gap: 5, borderColor: '#D8D8D8', borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
                        <LockIcon style={{ marginLeft: 8 }} name="lock" size={30} color="black" />
                        <TextInput secureTextEntry={true} placeholderTextColor={'grey'} style={{ color: 'gray', marginVertical: 1, width: 300, fontSize: password ? 16 : 16 }} placeholder="Enter your Password" value={password} onChangeText={(text) => setPassword(text)} />
                    </View>

                </View>

                <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <Text style={{ fontWeight: '500', color: "black" }} >Keep me Logged In</Text>
                    <Text style={{ fontWeight: '500', color: "#007FFF" }}>Forget Password</Text>
                </View>

                <Pressable onPress={handleLogin} style={{ width: 200, backgroundColor: 'black', padding: 15, marginTop: 40, marginLeft: 'auto', marginRight: 'auto', borderRadius: 6 }}>
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: 'white' }}>Login</Text>
                </Pressable>

                <Pressable onPress={() => navigation.navigate('Register')} style={{ marginTop: 10 }}>
                    <Text style={{ textAlign: "center", fontSize: 16, color: 'black' }}>Don't have an Account Sign Up</Text>
                </Pressable>

            </KeyboardAvoidingView>


        </View>
    );
}