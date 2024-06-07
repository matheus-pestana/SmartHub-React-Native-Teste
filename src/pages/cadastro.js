import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Cadastro = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.', [{ text: 'OK' }]);
            return;
        }

        createUserWithEmailAndPassword(auth, username, password)
            .then(userCredential => {
                console.log('Cadastro bem-sucedido!', userCredential.user);
                navigation.navigate('Login');
            })
            .catch(error => {
                Alert.alert(
                    'Erro no cadastro',
                    `Ocorreu um erro ao tentar criar sua conta. ${error.message}`,
                    [{ text: 'OK' }]
                );
            });

        setUsername('');
        setPassword('');
        setConfirmPassword('');
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
                    <View style={styles.cadastro}>
                        <Text style={styles.pageTitle}>Cadastro</Text>
                    </View>

                    <View style={styles.container}>
                        <Text style={styles.title}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Insira seu e-mail"
                            value={username}
                            onChangeText={(text) => setUsername(text)}
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
                        <Text style={styles.title}>Confirme a Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirme sua senha"
                            value={confirmPassword}
                            onChangeText={(text) => setConfirmPassword(text)}
                            secureTextEntry
                        />
                        <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
                            <Text style={styles.buttonText}>Cadastrar-se</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.buttonText}>Retornar ao login</Text>
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

    cadastro: {
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

export default Cadastro;
