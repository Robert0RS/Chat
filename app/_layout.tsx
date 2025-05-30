import { Stack } from "expo-router";

export default () => (
    <Stack>
        <Stack.Screen name="index"/>
        <Stack.Screen name="(chat)" options={{ headerShown: false }} />
        <Stack.Screen name="settings"/>
    </Stack>
);