import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
    const router = useRouter();
    const [serverAddress, setServerAddress] = useState("http://localhost:3000");

    useEffect(() => {
        (async () => {
            const localServerAddress = await AsyncStorage.getItem("serverAddress");
            if (localServerAddress) {
                setServerAddress(localServerAddress);
            }
        })();
    }, []);

    const handleSave = async () => {
        if (serverAddress.trim() === "") return;

        try {
            await AsyncStorage.setItem("serverAddress", serverAddress);
            Keyboard.dismiss();
            router.back();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={style.container}>
            <Text style={style.label}>Dirección del Servidor</Text>

            <TextInput
                style={style.input}
                value={serverAddress}
                onChangeText={setServerAddress}
                placeholder="http://tu-servidor.com"
                onSubmitEditing={handleSave}
                returnKeyType="done"
            />

            <TouchableOpacity style={style.button} onPress={handleSave}>
                <Text style={style.buttonText}>Guardar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f1f3f5',
    },
    label: {
        fontSize: 20,
        marginBottom: 10,
        color: '#333',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
