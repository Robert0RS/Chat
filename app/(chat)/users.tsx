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
        console.log('Usuario recibido en users:', user); // Debug log

        if (!user) {
            console.log('No hay usuario definido'); // Debug log
            return;
        }

        const setupSocket = async () => {
            try {
                console.log('Intentando conectar socket...'); // Debug log
                const newSocket = await connectSocket(user);
                if (newSocket) {
                    console.log('Socket conectado exitosamente'); // Debug log
                    setSocket(newSocket);
                    // Enviar el evento join inmediatamente después de conectar
                    newSocket.emit('join', { username: user });
                    console.log('Enviando join con usuario:', user);
                } else {
                    console.log('No se pudo conectar el socket'); // Debug log
                }
            } catch (error) {
                console.error('Error al conectar socket:', error);
            }
        };

        setupSocket();

        return () => {
            if (socket) {
                console.log('Desconectando socket...'); // Debug log
                socket.disconnect();
            }
        };
    }, [user]);

    // Efecto para manejar eventos del socket
    useEffect(() => {
        if (!socket) {
            console.log('No hay socket disponible'); // Debug log
            return;
        }

        console.log('Configurando listeners del socket...'); // Debug log

        const handleUsersUpdate = (data: ConnectedUser[]) => {
            console.log('Recibida actualización de usuarios:', data);
            setUsers(data);
        };

        socket.on('connect', () => {
            console.log('Socket conectado, enviando join...'); // Debug log
            socket.emit('join', { username: user });
        });

        socket.on('users:update', handleUsersUpdate);
        
        // Forzar una actualización de usuarios al conectar
        socket.emit('join', { username: user });

        return () => {
            console.log('Limpiando listeners del socket...'); // Debug log
            socket.off('users:update', handleUsersUpdate);
            socket.off('connect');
        };
    }, [socket, user]);

    return(
        <SafeAreaView style={{ flex: 1, padding: 20 }}>  
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Usuarios Conectados:</Text>
            <Text style={{ marginBottom: 10 }}>Tu usuario: {user}</Text>
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