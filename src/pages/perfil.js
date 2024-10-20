import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Perfil() {
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    } else {
                        console.log('Nenhum dado encontrado para este usuário.');
                    }
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário: ', error);
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleLogout = async () => {
        Alert.alert(
            'Confirmar Logout', // Título do alerta
            'Você tem certeza que deseja sair?', // Mensagem do alerta
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Logout cancelado'), // Ação ao cancelar
                    style: 'cancel', // Define o estilo de botão para "cancel"
                },
                {
                    text: 'Sim',
                    onPress: async () => { // Ação ao confirmar
                        try {
                            await AsyncStorage.removeItem('@user_token');
                            await signOut(getAuth());
                            Alert.alert('Logout realizado com sucesso!');
                            navigation.navigate('Login'); // Redireciona para a tela de login
                        } catch (error) {
                            console.error('Erro ao fazer logout: ', error);
                        }
                    },
                },
            ],
            { cancelable: false } // Não permite o usuário fechar o alerta tocando fora dele
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="white" style={styles.backIcon} />
                </TouchableOpacity>
                <Image
                    resizeMode='center'
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                />
            </View>

            <View style={styles.main}>
                <Image
                    style={styles.user}
                    source={require('../assets/user.png')}
                />
                <View style={styles.infos}>
                    <View style={styles.nome}>
                        <Text style={styles.info}>Nome:</Text>
                        <Text style={styles.nomeUser}>{userData?.name || 'Carregando...'}</Text>
                    </View>

                    <View style={styles.email}>
                        <Text style={styles.info}>Email:</Text>
                        <Text style={styles.emailUser}>{userData?.email || 'Carregando...'}</Text>
                    </View>

                    <View style={styles.senha}>
                        <Text style={styles.info}>Senha:</Text>
                        <Text style={styles.senhaUser}>******</Text>
                    </View>
                </View>
            </View>


            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        backgroundColor: 'black',
        flex: 1,
    },

    topBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '10%',
        borderBottomColor: '#5D21A7',
        borderBottomWidth: 1,
        position: 'relative',
    },

    logo: {
        width: '50%',
        height: '70%',
    },

    backButton: {
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: [{ translateY: -14 }],
    },

    icons: {
        width: '20%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
    },

    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    main: {
        width: '100%',
        paddingVertical: 20,
        flexGrow: 1,
        alignItems: 'center',
    },

    user: {
        width: '45%',
        height: '30%',
        borderRadius: 100,
        borderColor: '#5D21A7',
        borderWidth: 3,
    },

    logoutButton: {
        backgroundColor: '#5D21A7',
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center',
        marginVertical: 20,
    },

    logoutText: {
        fontSize: 24,
        color: 'white',
    },

    infos: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
        gap: 30,
    },

    info: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        padding: 10,
    },

    nome: {
        width: '90%',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        flexDirection: 'row',
        borderBottomColor: '#5D21A7',
        borderWidth: 1,
        alignItems: 'center',
    },

    email: {
        width: '90%',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        flexDirection: 'row',
        borderBottomColor: '#5D21A7',
        borderWidth: 1,
        alignItems: 'center',
    },

    senha: {
        width: '90%',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        flexDirection: 'row',
        borderBottomColor: '#5D21A7',
        borderWidth: 1,
        alignItems: 'center',
    },

    nomeUser: {
        fontSize: 16,
        color: 'white',
    },

    emailUser: {
        fontSize: 16,
        color: 'white',
    },

    senhaUser: {
        fontSize: 16,
        color: 'white',
    },

});
