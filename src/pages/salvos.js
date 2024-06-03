import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Salvos() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigation = useNavigation();

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Tem certeza de que deseja sair?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    onPress: () => {
                        setIsLoggedIn(false);
                        console.log('Logout realizado com sucesso!');
                        navigation.navigate('Login');
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <Image
                    resizeMode='center'
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    container: {
        paddingVertical: 20,
        backgroundColor: 'black',
        flex: 1,
    },

    topBar: {
        width: '100%',
        height: '10%',
        alignItems: 'center',
        borderBottomColor: '#5D21A7',
        borderBottomWidth: 1,
    },

    logo: {
        width: '80%',
        height: '80%',
    },

    logoutText: {
        fontSize: 24,
        color: 'white',
    },

})