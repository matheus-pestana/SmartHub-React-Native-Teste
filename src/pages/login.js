import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigation = useNavigation();


    const handleLogin = () => {
        const usernameStatic = 'usuario';
        const passwordStatic = 'senha123';

        if (username === usernameStatic && password === passwordStatic) {
            console.log('Login bem-sucedido!');
            setIsLoggedIn(true);
            navigation.navigate('Home');
        } else {
            alert(
                'Credenciais incorretas',
                'Por favor, verifique seu nome de usuário e senha e tente novamente.',
                [{ text: 'OK' }]
            );
        }

        setUsername('');
        setPassword('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView keyboardShouldPersistTaps='handled' style={styles.scroll}>


                <View style={styles.main}>
                    <Image
                        resizeMode='center'
                        style={styles.logo}
                        source={require('../assets/logo.png')}
                    />

                    <View style={styles.container}>
                        <Text style={styles.title}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Insira seu e-mail"
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                        />
                        <Text style={styles.title}>Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Insira sua senha"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({

    safeArea: {
        backgroundColor: 'black',
        flex: 1,
    },

    scroll: {
        flexGrow: 1,
        backgroundColor: 'black',
    },

    main: {
        flex: 1,
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: windowHeight,
    },

    logo: {
        width: '60%',
        height: '40%',
    },

    container: {
        flex: 1,
    },

    title: {
        color: 'white',
        fontSize: 24,
        marginBottom: 10,
    },
    input: {
        padding: 10,
        width: 300,
        height: 45,
        borderColor: 'gray',
        borderWidth: .5,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,

    },
    
    loginButton: {
        marginTop: 20,
        backgroundColor: '#5D21A7',
        paddingVertical: 10,
        borderRadius: 5,
        shadowColor: '#5D21A7',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default LoginPage;
