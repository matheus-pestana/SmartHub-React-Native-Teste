import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import Home from '../pages/home.js';
import Login from '../pages/login.js';
import Salvos from '../pages/salvos.js';
import Continuar from '../pages/continuar.js';
import Cadastro from '../pages/cadastro.js';
import Perfil from '../pages/perfil.js';
import Senha from '../pages/senha.js'

const Tab = createBottomTabNavigator();

function MyTabs({ category }) {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarStyle: { backgroundColor: 'black', borderTopColor: '#5D21A7' },
                tabBarActiveTintColor: "#5D21A7",
                tabBarInactiveTintColor: "#5D21A7",
            }}>
            <Tab.Screen
                name="Home"
                children={() => <Home category={category} />} // Passa a categoria para o Home
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, size, color }) => {
                        if (focused) {
                            return (<Ionicons size={size} color={color} name='home-sharp' />);
                        } return (<Ionicons size={size} color={color} name='home-outline' />);
                    }
                }} />
            <Tab.Screen
                name="Continuar"
                component={Continuar}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, size, color }) => {
                        if (focused) {
                            return (<Ionicons size={size} color={color} name='play-circle' />);
                        } return (<Ionicons size={size} color={color} name='play-circle-outline' />);
                    }
                }} />
            <Tab.Screen
                name="Salvos"
                component={Salvos}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, size, color }) => {
                        if (focused) {
                            return (<Ionicons size={size} color={color} name='bookmark' />);
                        } return (<Ionicons size={size} color={color} name='bookmark-outline' />);
                    }
                }} />
        </Tab.Navigator>
    );
}

const Drawer = createDrawerNavigator();

function MyDrawer() {
    return (
        <Drawer.Navigator
            initialRouteName="Main"
            screenOptions={{
                drawerStyle: {
                    backgroundColor: '#000',
                    borderRightColor: '#5D21A7',
                    borderWidth: 1,
                },
                drawerLabelStyle: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#5D21A7',
                    borderColor: '#5D21A7',
                    borderBottomWidth: 1,
                    padding: 5,
                }
            }}
        >
            <Drawer.Screen
                name="Todas"
                children={() => <MyTabs category="todas" />}
                options={{ title: 'Todas as Categorias', headerShown: false }}
            />
            <Drawer.Screen
                name="Arte"
                children={() => <MyTabs category="arte" />}
                options={{ title: 'Arte', headerShown: false }}
            />
            <Drawer.Screen
                name="Matemática"
                children={() => <MyTabs category="matematica" />}
                options={{ title: 'Matemática', headerShown: false }}
            />
            <Drawer.Screen
                name="Física"
                children={() => <MyTabs category="fisica" />}
                options={{ title: 'Física', headerShown: false }}
            />
        </Drawer.Navigator>
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
            <Stack.Screen name="Main" component={MyDrawer} />
            <Stack.Screen name="Perfil" component={Perfil} />
            <Stack.Screen name="Senha" component={Senha} />
        </Stack.Navigator>
    );
}

const CombinedScreen = () => {
    return (
      <View style={{ flex: 1 }}>
        <MyTabs />
        <Home />
      </View>
    );
  };