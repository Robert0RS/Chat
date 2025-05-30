import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default () => (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#20c020"}}>
        <Tabs.Screen 
        name="chat" 
        options={{tabBarIcon: ({color}) => <FontAwesome size={28} name="comment" color={color} /> 
        }} />
        <Tabs.Screen 
        name="users" 
        options={{ title: 'Usuarios', tabBarIcon: ({color})  => <FontAwesome size={28} name="users" color={color} /> 
        }} />
    </Tabs>
);