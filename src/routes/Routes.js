import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import Home from '../pages/home.js';
import Login from '../pages/login.js';
import Salvos from '../pages/salvos.js';
import Continuar from '../pages/continuar.js';
import Cadastro from '../pages/cadastro.js';
import Perfil from '../pages/perfil.js';

const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                tabBarStyle: { backgroundColor: 'black', borderTopColor: '#5D21A7' },
                tabBarActiveTintColor: "#5D21A7",
                tabBarInactiveTintColor: "#5D21A7",
            }}>
            <Tab.Screen name="Home" component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, size, color }) => {
                        if (focused) {
                            return (<Ionicons
                                size={size}
                                color={color}
                                name='home-sharp'
                            />);
                        } return (<Ionicons
                            size={size}
                            color={color}
                            name='home-outline'
                        />)
                    }
                }} />
            <Tab.Screen name="Continuar" component={Continuar}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, size, color }) => {
                        if (focused) {
                            return (<Ionicons
                                size={size}
                                color={color}
                                name='play-circle'
                            />);
                        } return (<Ionicons
                            size={size}
                            color={color}
                            name='play-circle-outline'
                        />)
                    }
                }} />
            <Tab.Screen name="Salvos" component={Salvos}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, size, color }) => {
                        if (focused) {
                            return (<Ionicons
                                size={size}
                                color={color}
                                name='bookmark'
                            />);
                        } return (<Ionicons
                            size={size}
                            color={color}
                            name='bookmark-outline'
                        />)
                    }
                }} />
        </Tab.Navigator>
    );
}

const Stack = createNativeStackNavigator();

export default function MyStack() {

    return (
        <Stack.Navigator
        initialRouteName='Login'
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
            <Stack.Screen name="Main" component={MyTabs} />
            <Stack.Screen name="Perfil" component={Perfil} />
        </Stack.Navigator>
    );
}