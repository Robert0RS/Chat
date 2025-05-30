import { Link, Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default () => {
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleEnter = () => {
        if (username.trim() !== '') {
            Keyboard.dismiss(); // Oculta el teclado
            router.push({ pathname: '/chat', params: { user: username } });
        }
    };

    return (
        <SafeAreaView style={style.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Text style={style.title}>Bienvenido al chat</Text>

            <TextInput
                style={style.input}
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
                onSubmitEditing={handleEnter}
                returnKeyType="done"
            />

            <TouchableOpacity
                style={style.button}
                onPress={handleEnter}
            >
                <Text style={style.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <Link href="/settings" asChild>
                <TouchableOpacity>
                    <Text style={style.link}>Configuración</Text>
                </TouchableOpacity>
            </Link>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '90%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 15,
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 20,
        fontSize: 16,
        color: '#007bff',
        textDecorationLine: 'underline',
    },
});
