import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Senha = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');

    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert('Erro', 'Por favor, insira seu e-mail');
            return;
        }

        try {
            // Envia o e-mail de redefinição de senha
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Sucesso', 'E-mail de redefinição de senha enviado!');
            navigation.navigate('Login'); // Redireciona para a tela de login após sucesso
        } catch (error) {
            console.error('Erro ao enviar e-mail de redefinição de senha: ', error);
            if (error.code === 'auth/user-not-found') {
                Alert.alert('Erro', 'Usuário não encontrado');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Erro', 'E-mail inválido');
            } else {
                Alert.alert('Erro', 'Erro ao enviar e-mail de redefinição de senha');
            }
        }
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
                        <Text style={styles.pageTitle}>Alterar senha</Text>
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
                        <TouchableOpacity style={styles.loginButton} onPress={handlePasswordReset}>
                            <Text style={styles.buttonText}>Enviar e-mail de redefinição</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.resetPassword} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.resetPasswordText}>Retornar ao login</Text>
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

    resetPasswordText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Senha;
