import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

export async function connectSocket(user: string) {
    try {
        const serverAddress = 
            await AsyncStorage.getItem("serverAddress") ||
            "http://localhost:3000";
        return io(serverAddress, {query: {user}});
    }catch (error) {
        console.error(error);
    }
}