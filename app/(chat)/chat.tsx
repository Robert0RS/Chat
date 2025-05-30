import React,{useState, useEffect} from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";
import { connectSocket } from "../../src/socket";
import { Socket } from "socket.io-client";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatMessage } from "../../src/models/ChatMessage";
import { useLocalSearchParams } from "expo-router";

type MessageBubbleProps = {
    ChatMessage: ChatMessage;
    mySocketId?: string
};
const MessageBubble = ({ChatMessage, mySocketId}:MessageBubbleProps) => {
    let bubbleStyle = [styles.tumensaje];
    let ownMessage = ChatMessage.socketId == mySocketId;

    ownMessage
        ? bubbleStyle.push(styles.mimensaje)
        : bubbleStyle.push(styles.tumensaje);
    
    return (
        <View>
            {!ownMessage && <Text>{ChatMessage.user}</Text>}
            <Text style={bubbleStyle}>{ChatMessage.message}</Text>
        </View>
    );
};

type lsp = {
    user: string;
}

export default function () {
    const { user } = useLocalSearchParams<lsp>();
    const [socket, setSocket] = useState<Socket | undefined>(undefined);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [message, setMessage] = useState<string>("");
    const [isloading, setLoading] = useState<boolean>(true);
    const [mySocketId, setMySocketId] = useState<string>();

    useEffect(() => {
        connectSocket(user).then((socket) => {
            setSocket(socket);
            setLoading(false);
        }).catch(error => console.error(error));
        return () => {
            if(socket) {
                socket?.disconnect();
            }
        }
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket?.on("connect", () => {
            setMySocketId(socket.id);
        })
        socket?.on("message", (message: ChatMessage) => {
            setMessages((messages) => [...messages, message]);
        });
        return () => {
            socket?.off("message");
        }
    }, [socket]);

    const sendMessage = () => {
        if(message.trim()) {
            socket?.emit("message", message);
            setMessage("");
        }
    };

    if(isloading) {
        return <ActivityIndicator size="large" color="#0000ff" />
    }

    return (
        <SafeAreaView style={{flex: 1, justifyContent: "center", padding: 20}}>
            <FlatList
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({item}) => (
                    <MessageBubble ChatMessage={item} mySocketId={mySocketId} />
                )}
            />
            <View style={{flexDirection: "row"}}>
                <TextInput
                    style={{flex: 1, borderWidth: 1, borderColor: "green"}}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Escribe un mensaje pues"
                />
                <Button title="Mandar" onPress={sendMessage} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mimensaje: {
        marginVertical: 5,
        fontSize: 16, 
        color: "white", 
        backgroundColor: "#00B67E",
        paddingHorizontal: 10, 
        paddingVertical: 5,
        borderRadius: 5, 
        alignSelf: "flex-end",
        fontWeight: "bold"
    } as ViewStyle,
    tumensaje: {
        marginVertical: 5,
        fontSize: 16, 
        color: "white", 
        backgroundColor: "#572364",
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 5, 
        alignSelf: "flex-start",
        fontWeight: "bold"
    } as ViewStyle,
    mensajeserver: {
        marginVertical: 5,
        fontSize: 16, 
        color: "white", 
        backgroundColor: "black",
        paddingHorizontal: 10, 
        paddingVertical: 5,
        borderRadius: 5, 
        alignSelf: "center",
        fontWeight: "bold"
    } as ViewStyle
});