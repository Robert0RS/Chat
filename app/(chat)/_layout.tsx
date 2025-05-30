import { Tabs, useLocalSearchParams } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default () => {
    const { user } = useLocalSearchParams<{ user: string }>();

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "#20c020"}}>
            <Tabs.Screen 
                name="chat" 
                options={{
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="comment" color={color} />,
                    href: `/chat?user=${user}`
                }} 
            />
            <Tabs.Screen 
                name="users" 
                options={{ 
                    title: 'Usuarios', 
                    tabBarIcon: ({color})  => <FontAwesome size={28} name="users" color={color} />,
                    href: `/users?user=${user}`
                }} 
            />
        </Tabs>
    );
};