import { View, Text, Image, Alert } from "react-native";
import React, { useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LockIcon from 'react-native-vector-icons/AntDesign'
import PersonIcon from 'react-native-vector-icons/Ionicons'
import ImageIcon from 'react-native-vector-icons/EvilIcons'
import { TextInput } from "react-native";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";


export default function RegisterScreen()
{
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [image, setImage] = useState();
    const navigation = useNavigation();

    const handleRegister = () =>
    {
        const user = {
            name: name,
            email: email,
            password: password,
            image: image,
        };

        console.log(name);
        console.log(email);
        console.log(password);
        console.log(image);



        axios.post("http://192.168.1.36:8000/register", user).then((response) =>
        {
            console.log(response);
            Alert.alert("Registration Successful");

            setName("");
            setEmail("");
            setPassword("");
            setImage("");

            navigation.navigate("Login");

        }).catch((error) =>
        {
            Alert.alert("Registration Failed");
            console.log("error", error);
        });

    }




    return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: "center" }}>
            <View style={{ marginTop: 50 }}>
                <Image style={{ width: 150, height: 100, resizeMode: "contain" }} source={require("../assets/masculine.jpg")} />

            </View>

            <KeyboardAvoidingView>
                <View style={{ alignItems: "center", justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, fontWeight: 'bold', marginTop: 20, color: 'black' }}>Register to Your Account</Text>
                </View>

                <View style={{ marginTop: 30 }}>
                    <View style={{ flexDirection: 'row', alignItems: "center", gap: 5, borderColor: '#D8D8D8', borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
                        <PersonIcon style={{ marginLeft: 8 }} name="person" size={30} color="black" />
                        <TextInput placeholderTextColor={'grey'} style={{ color: 'gray', marginVertical: 1, width: 300, fontSize: name ? 16 : 16 }} placeholder="Enter your Name" value={name} onChangeText={(text) => setName(text)} />
                    </View>

                </View>

                <View style={{ marginTop: 30 }}>
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

                <View style={{ marginTop: 30 }}>
                    <View style={{ flexDirection: 'row', alignItems: "center", gap: 5, borderColor: '#D8D8D8', borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
                        <ImageIcon style={{ marginLeft: 8 }} name="image" size={30} color="black" />
                        <TextInput placeholderTextColor={'grey'} style={{ color: 'gray', marginVertical: 1, width: 300, fontSize: image ? 16 : 16 }} placeholder="Enter your Image" value={image} onChangeText={(text) => setImage(text)} />
                    </View>

                </View>

                {/* <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <Text style={{ fontWeight: '500', color: "black" }} >Keep me Logged In</Text>
                    <Text style={{ fontWeight: '500', color: "#007FFF" }}>Forget Password</Text>
                </View> */}

                <Pressable onPress={handleRegister} style={{ width: 200, backgroundColor: 'black', padding: 15, marginTop: 80, marginLeft: 'auto', marginRight: 'auto', borderRadius: 6 }}>
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, color: 'white' }}>Register</Text>
                </Pressable>

                <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 10 }}>
                    <Text style={{ textAlign: "center", fontSize: 16, color: 'black' }}>Already have an Account ? Sign In</Text>
                </Pressable>

            </KeyboardAvoidingView>


        </View>
    );
}