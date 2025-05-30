import {SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { connectSocket } from "../../src/socket";
import { FlatList, Text, View } from "react-native";

interface ConnectedUser {
    socketId: string;
    username: string;
}

export default() => {
    const { user } = useLocalSearchParams<{ user: string }>();
    const [socket, setSocket] = useState<Socket>();
    const [users, setUsers] = useState<ConnectedUser[]>([]);

    // Efecto para conectar el socket
    useEffect(() => {
        if (!user) return;

        const setupSocket = async () => {
            try {
                const newSocket = await connectSocket(user);
                if (newSocket) {
                    setSocket(newSocket);
                    // Enviar el evento join inmediatamente después de conectar
                    newSocket.emit('join', { username: user });
                    console.log('Enviando join con usuario:', user);
                }
            } catch (error) {
                console.error('Error al conectar socket:', error);
            }
        };

        setupSocket();

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [user]);

    // Efecto para manejar eventos del socket
    useEffect(() => {
        if (!socket) return;

        const handleUsersUpdate = (data: ConnectedUser[]) => {
            console.log('Recibida actualización de usuarios:', data);
            setUsers(data);
        };

        socket.on('users:update', handleUsersUpdate);
        
        // Forzar una actualización de usuarios al conectar
        socket.emit('join', { username: user });

        return () => {
            socket.off('users:update', handleUsersUpdate);
        };
    }, [socket, user]);

    return(
        <SafeAreaView style={{ flex: 1, padding: 20 }}>  
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Usuarios Conectados:</Text>
            <FlatList 
                data={users}
                keyExtractor={(item) => item.socketId}
                renderItem={({item}) => (
                    <View style={{ padding: 10, backgroundColor: '#f0f0f0', marginVertical: 5, borderRadius: 5 }}>
                        <Text>{item.username}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay usuarios conectados</Text>
                }
            />
        </SafeAreaView>
    )
}