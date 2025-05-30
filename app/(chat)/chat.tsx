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
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    useEffect(() => {
        if (!user) return;

        const setupSocket = async () => {
            try {
                const newSocket = await connectSocket(user);
                if (newSocket) {
                    setSocket(newSocket);
                    console.log('Socket conectado, enviando join...');
                    newSocket.emit('join', { username: user });
                }
            } catch (error) {
                console.error('Error al conectar socket:', error);
            }
        };

        setupSocket();

        return () => {
            if(socket) {
                socket.disconnect();
            }
        }
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        socket.on("connect", () => {
            console.log('Socket conectado, enviando join...');
            setMySocketId(socket.id);
            socket.emit('join', { username: user });
        });

        socket.on("users:update", () => {
            console.log('Usuario registrado correctamente');
            setIsRegistered(true);
            setLoading(false);
        });

        socket.on("message", (message: ChatMessage) => {
            setMessages((messages) => [...messages, message]);
        });

        return () => {
            socket.off("message");
            socket.off("users:update");
            socket.off("connect");
        }
    }, [socket]);

    const sendMessage = () => {
        if(message.trim() && isRegistered) {
            socket?.emit("message", message);
            setMessage("");
        } else if (!isRegistered) {
            console.log('Usuario no registrado aún, no se puede enviar mensaje');
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
                    placeholder="Escribe aqui tu mensaje..."
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
        backgroundColor: "#2196F3",
        paddingHorizontal: 10, 
        paddingVertical: 5,
        borderRadius: 15,
        alignSelf: "flex-end",
        fontWeight: "bold",
        maxWidth: '80%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2
    } as ViewStyle,
    tumensaje: {
        marginVertical: 5,
        fontSize: 16, 
        color: "white", 
        backgroundColor: "#4CAF50",
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 15,
        alignSelf: "flex-start",
        fontWeight: "bold",
        maxWidth: '80%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2
    } as ViewStyle,
    mensajeserver: {
        marginVertical: 5,
        fontSize: 16, 
        color: "white", 
        backgroundColor: "#9E9E9E",
        paddingHorizontal: 10, 
        paddingVertical: 5,
        borderRadius: 15,
        alignSelf: "center",
        fontWeight: "bold",
        maxWidth: '80%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2
    } as ViewStyle
});