import
{
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Pressable,
    Image,
} from "react-native";
import React, { useState, useContext, useLayoutEffect, useEffect, useRef } from "react";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../userContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['ReactImageView:']);
LogBox.ignoreAllLogs();

export default function ChatMessagesScreen()
{
    const [showEmojiSelector, setShowEmojiSelector] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [recepientData, setRecepientData] = useState();
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState("");
    const route = useRoute();
    const { recepientId } = route.params;
    const [message, setMessage] = useState("");
    const { userId, setUserId } = useContext(UserType);

    const scrollViewRef = useRef(null);

    useEffect(() =>
    {
        scrollToBottom();
    }, []);

    const scrollToBottom = () =>
    {
        if (scrollViewRef.current)
        {
            scrollViewRef.current.scrollToEnd({ animated: false });
        }
    };

    const handleContentSizeChange = () =>
    {
        scrollToBottom();
    };

    const handleEmojiPress = () =>
    {
        setShowEmojiSelector(!showEmojiSelector);
    };



    const fetchMessages = async () =>
    {
        try
        {
            const response = await fetch(
                `http://192.168.1.36:8000/messages/${userId}/${recepientId}`
            );
            const data = await response.json();

            if (response.ok)
            {
                setMessages(data);
            } else
            {
                console.log("error showing messags", response.status.message);
            }
        } catch (error)
        {
            console.log("error fetching messages", error);
        }
    };

    useEffect(() =>
    {
        fetchMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() =>
    {
        const fetchRecepientData = async () =>
        {
            try
            {
                const response = await fetch(
                    `http://192.168.1.36:8000/user/${recepientId}`
                );

                const data = await response.json();
                setRecepientData(data);
            } catch (error)
            {
                console.log("error retrieving details", error);
            }
        };

        fetchRecepientData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleSend = async (messageType, imageUri) =>
    {
        try
        {
            const formData = new FormData();
            formData.append("senderId", userId);
            formData.append("recepientId", recepientId);

            //if the message type id image or a normal text
            if (messageType === "image")
            {
                formData.append("messageType", "image");
                formData.append("imageFile", {
                    uri: imageUri,
                    name: "image.jpg",
                    type: "image/jpeg",
                });
            } else
            {
                formData.append("messageType", "text");
                formData.append("messageText", message);
            }

            const response = await fetch("http://192.168.1.36:8000/messages", {
                method: "POST",
                body: formData,
            });

            if (response.ok)
            {
                setMessage("");
                setSelectedImage("");

                fetchMessages();
            }
        } catch (error)
        {
            console.log("error in sending the message", error);
        }
    };

    console.log("messages", selectedMessages);
    useLayoutEffect(() =>
    {
        navigation.setOptions({
            headerTitle: "",
            // eslint-disable-next-line react/no-unstable-nested-components
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>

                    {selectedMessages.length > 0 ? (
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: "500", color: 'black' }}>
                                {selectedMessages.length}
                            </Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    resizeMode: "cover",
                                }}
                                source={{ uri: recepientData?.image }}
                            />

                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold", color: 'black' }}>
                                {recepientData?.name}
                            </Text>
                        </View>
                    )}
                </View>
            ),
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () =>
                selectedMessages.length > 0 ? (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>

                    </View>
                ) : null,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recepientData, selectedMessages]);

    const deleteMessages = async (messageIds) =>
    {
        try
        {
            const response = await fetch("http://192.168.1.36:8000/deleteMessages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: messageIds }),
            });

            if (response.ok)
            {
                setSelectedMessages((prevSelectedMessages) =>
                    prevSelectedMessages.filter((id) => !messageIds.includes(id))
                );

                fetchMessages();
            } else
            {
                console.log("error deleting messages", response.status);
            }
        } catch (error)
        {
            console.log("error deleting messages", error);
        }
    };
    const formatTime = (time) =>
    {
        const options = { hour: "numeric", minute: "numeric" };
        return new Date(time).toLocaleString("en-US", options);
    };

    // eslint-disable-next-line no-shadow
    const handleSelectMessage = (message) =>
    {
        //check if the message is already selected
        const isSelected = selectedMessages.includes(message._id);

        if (isSelected)
        {
            setSelectedMessages((previousMessages) =>
                previousMessages.filter((id) => id !== message._id)
            );
        } else
        {
            setSelectedMessages((previousMessages) => [
                ...previousMessages,
                message._id,
            ]);
        }
    };
    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
            <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }} onContentSizeChange={handleContentSizeChange}>
                {messages.map((item, index) =>
                {
                    if (item.messageType === "text")
                    {
                        const isSelected = selectedMessages.includes(item._id);
                        return (
                            <Pressable
                                onLongPress={() => handleSelectMessage(item)}
                                key={index}
                                style={[
                                    item?.senderId?._id === userId
                                        ? {
                                            alignSelf: "flex-end",
                                            backgroundColor: "#DCF8C6",
                                            padding: 8,
                                            maxWidth: "60%",
                                            borderRadius: 7,
                                            margin: 10,
                                        }
                                        : {
                                            alignSelf: "flex-start",
                                            backgroundColor: "white",
                                            padding: 8,
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: "60%",
                                        },

                                    isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: 'black',
                                        textAlign: isSelected ? "right" : "left",
                                    }}
                                >
                                    {item?.message}
                                </Text>
                                <Text
                                    style={{
                                        textAlign: "right",
                                        fontSize: 9,
                                        color: "gray",
                                        marginTop: 5,
                                    }}
                                >
                                    {formatTime(item.timeStamp)}
                                </Text>
                            </Pressable>
                        );
                    }

                    if (item.messageType === "image")
                    {
                        const baseUrl =
                            "/Users/mukul/Build/partner-project/api/files/";
                        const imageUrl = item.imageUrl;
                        const filename = imageUrl.split("/").pop();
                        const source = { uri: baseUrl + filename };
                        return (
                            <Pressable
                                key={index}
                                style={[
                                    item?.senderId?._id === userId
                                        ? {
                                            alignSelf: "flex-end",
                                            backgroundColor: "#DCF8C6",
                                            padding: 8,
                                            maxWidth: "60%",
                                            borderRadius: 7,
                                            margin: 10,
                                        }
                                        : {
                                            alignSelf: "flex-start",
                                            backgroundColor: "white",
                                            padding: 8,
                                            margin: 10,
                                            borderRadius: 7,
                                            maxWidth: "60%",
                                        },
                                ]}
                            >
                                <View>
                                    <Image
                                        source={source}
                                        style={{ width: 200, height: 200, borderRadius: 7 }}
                                    />
                                    <Text
                                        style={{
                                            textAlign: "right",
                                            fontSize: 9,
                                            position: "absolute",
                                            right: 10,
                                            bottom: 7,
                                            color: "white",
                                            marginTop: 5,
                                        }}
                                    >
                                        {formatTime(item?.timeStamp)}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    }
                })}
            </ScrollView>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: "#dddddd",
                    marginBottom: showEmojiSelector ? 0 : 25,
                }}
            >


                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={{
                        flex: 1,
                        height: 40,
                        borderWidth: 1,
                        borderColor: "#dddddd",
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        color: 'black'
                    }}
                    placeholder="Type Your message..."
                    placeholderTextColor={'black'}
                />

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 7,
                        marginHorizontal: 8,
                    }}
                >

                </View>

                <Pressable
                    onPress={() => handleSend("text")}
                    style={{
                        backgroundColor: "#007bff",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 20,
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
                </Pressable>
            </View>

            {showEmojiSelector && (
                <EmojiSelector
                    onEmojiSelected={(emoji) =>
                    {
                        setMessage((prevMessage) => prevMessage + emoji);
                    }}
                    style={{ height: 250 }}
                />
            )}
        </KeyboardAvoidingView>
    );
}

