import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const checkSession = async () => {
            const storedUser = await AsyncStorage.getItem('@user_token');
            if (storedUser) {
                navigation.navigate('Main');
            } else {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    if (user) {
                        navigation.navigate('Main');
                    }
                });
                return unsubscribe;
            }
        };

        checkSession();
    }, []);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                console.log('Login bem-sucedido!', userCredential.user);
                await AsyncStorage.setItem('@user_token', userCredential.user.uid); // Armazena o token
                navigation.navigate('Main');
            })
            .catch(error => {
                Alert.alert(
                    'Erro no login',
                    `Ocorreu um erro ao tentar entrar. ${error.message}`,
                    [{ text: 'OK' }]
                );
            });

        setEmail('');
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

                    <View style={styles.login}>
                        <Text style={styles.pageTitle}>Login</Text>
                    </View>

                    <View style={styles.container}>
                        <Text style={styles.title}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Insira seu e-mail"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
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
                        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Cadastro')}>
                            <Text style={styles.buttonText}>Cadastrar-se</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.senhaButton} onPress={() => navigation.navigate('Senha')}>
                            <Text style={styles.senhaText}>Alterar senha</Text>
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
        height: '25%',
    },

    login: {
        width: windowWidth,
        alignItems: 'center',
    },

    pageTitle: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
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
        borderWidth: 0.5,
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

    resetPassword: {
        marginTop: 20,
        paddingVertical: 10,
        borderColor: '#5D21A7',
        borderWidth: 1,
        borderRadius: 5,
    },

    resetPasswordText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },

    senhaButton: {
        marginTop: 20,
        borderColor: '#5D21A7',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },

    senhaText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#fff'
    },
});

export default LoginPage;
