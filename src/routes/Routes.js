import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {View, Text} from 'react-native';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function HomeScreen() {
    return (
        <View>
            <Text>Careca</Text>
        </View>
    )
}

function SettingsScreen() {
    return (
        <View>
            <Text>A</Text>
        </View>
    )
}