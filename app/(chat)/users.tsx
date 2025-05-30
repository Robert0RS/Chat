import {SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { connectSocket } from "../../src/socket";
import { FlatList, Text, View, StyleSheet } from "react-native";

interface ConnectedUser {
    socketId: string;
    username: string;
}

export default() => {
    const { user } = useLocalSearchParams<{ user: string }>();
    const [socket, setSocket] = useState<Socket>();
    const [users, setUsers] = useState<ConnectedUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Efecto para conectar el socket y manejar eventos
    useEffect(() => {
        if (!user) {
            console.log('No hay usuario definido');
            return;
        }

        const setupSocket = async () => {
            try {
                console.log('Intentando conectar socket...');
                const newSocket = await connectSocket(user);
                if (newSocket) {
                    console.log('Socket conectado exitosamente');
                    setSocket(newSocket);
                    
                    // Configurar listeners del socket
                    newSocket.on('users:update', (data: ConnectedUser[]) => {
                        console.log('Recibida actualización de usuarios:', data);
                        if (Array.isArray(data)) {
                            // Filtrar duplicados por socketId
                            const uniqueUsers = data.filter((user, index, self) =>
                                index === self.findIndex((u) => u.socketId === user.socketId)
                            );
                            console.log('Usuarios únicos a mostrar:', uniqueUsers);
                            setUsers(uniqueUsers);
                            setIsLoading(false);
                        } else {
                            console.error('Datos de usuarios no válidos:', data);
                        }
                    });

                    // No necesitamos enviar join aquí porque ya se envió en el chat
                } else {
                    console.log('No se pudo conectar el socket');
                }
            } catch (error) {
                console.error('Error al conectar socket:', error);
            }
        };

        setupSocket();

        return () => {
            if (socket) {
                console.log('Desconectando socket...');
                socket.disconnect();
            }
        };
    }, [user]);

    const renderUser = ({ item }: { item: ConnectedUser }) => {
        console.log('Renderizando usuario:', item);
        return (
            <View style={[
                styles.userItem,
                item.username === user && styles.currentUser
            ]}>
                <Text style={styles.username}>{item.username}</Text>
                {item.username === user && (
                    <Text style={styles.youLabel}>(Tú)</Text>
                )}
            </View>
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.loadingText}>Cargando usuarios...</Text>
            </SafeAreaView>
        );
    }

    return(
        <SafeAreaView style={styles.container}>  
            <View style={styles.header}>
                <Text style={styles.title}>Usuarios Conectados</Text>
                <Text style={styles.subtitle}>Total: {users.length}</Text>
            </View>
            
            <FlatList 
                data={users}
                keyExtractor={(item) => item.socketId}
                renderItem={renderUser}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No hay usuarios conectados</Text>
                    </View>
                }
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa'
    },
    header: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5
    },
    subtitle: {
        fontSize: 16,
        color: '#666'
    },
    userItem: {
        padding: 15,
        backgroundColor: '#fff',
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    currentUser: {
        backgroundColor: '#e3f2fd',
        borderLeftWidth: 4,
        borderLeftColor: '#2196f3'
    },
    username: {
        fontSize: 16,
        color: '#333'
    },
    youLabel: {
        fontSize: 14,
        color: '#2196f3',
        fontWeight: 'bold'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    }
});