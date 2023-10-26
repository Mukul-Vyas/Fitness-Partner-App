import { View, Text } from "react-native";
import React from 'react';


export default function CardChoice({ type })
{
    return (

        <View>
            <Text style={{ borderColor: type === 'Like' ? '#01FF84' : '#F6006B', color: type === 'Like' ? '#01FF84' : '#F6006B', fontSize: 40, borderWidth: 4, paddingLeft: 10, paddingRight: 10 }}>{type}</Text>
        </View>

    );
};