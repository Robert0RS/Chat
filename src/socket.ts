import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

export async function connectSocket(user: string) {
    try {
        // Usar la IP de tu computadora en lugar de localhost
        const serverAddress = 
            await AsyncStorage.getItem("serverAddress") ||
            "http://localhost:3000"; // Cambia esto por la IP de tu computadora
        
        console.log('Conectando a:', serverAddress);
        
        const socket = io(serverAddress, {
            query: { user },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        // Agregar listeners para depuración
        socket.on('connect', () => {
            console.log('Socket conectado con ID:', socket.id);
        });

        socket.on('connect_error', (error) => {
            console.error('Error de conexión:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket desconectado:', reason);
        });

        return socket;
    } catch (error) {
        console.error('Error al crear socket:', error);
        return null;
    }
}