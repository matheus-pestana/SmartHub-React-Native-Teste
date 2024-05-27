import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import MyTabs from './src/routes/Routes';

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}