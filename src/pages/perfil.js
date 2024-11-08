import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig';

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
            'Confirmar Logout',
            'Você tem certeza que deseja sair?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Logout cancelado'),
                    style: 'cancel',
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('@user_token');
                            await signOut(getAuth());
                            Alert.alert('Logout realizado com sucesso!');
                            navigation.navigate('Login');
                        } catch (error) {
                            console.error('Erro ao fazer logout: ', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleChangephotoURL = async () => {
        if (!user) {
            Alert.alert('Erro', 'Usuário não autenticado. Por favor, faça login novamente.');
            navigation.navigate('Login');  // Redireciona para a tela de login
            return;
        }

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted) {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                const sourceUri = result.assets[0].uri;

                try {
                    const imageRef = ref(storage, 'photoURLs/' + user.uid);
                    const response = await fetch(sourceUri);
                    const blob = await response.blob();
                    await uploadBytes(imageRef, blob);

                    const downloadURL = await getDownloadURL(imageRef);

                    await updatephotoURLInFirestore(downloadURL);
                } catch (error) {
                    console.error('Erro ao alterar foto de perfil:', error);
                }
            }
        } else {
            Alert.alert('Permissão negada', 'Você precisa permitir o acesso à galeria para alterar a foto de perfil.');
        }
    };

    const updatephotoURLInFirestore = async (downloadURL) => {
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { photoURL: downloadURL }, { merge: true });
            setUserData((prevData) => ({ ...prevData, photoURL: downloadURL }));
            Alert.alert('Foto de perfil atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar foto de perfil no Firestore:', error);
        }
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
                <TouchableOpacity onPress={handleChangephotoURL}>
                    <Image
                        style={styles.user}
                        key={userData?.photoURL}  // Adiciona a URL da imagem como chave para forçar a re-renderização
                        source={userData?.photoURL ? { uri: userData.photoURL } : require('../assets/user.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.changePictureButton} onPress={handleChangephotoURL}>
                    <Text style={styles.changePictureText}>Alterar Foto</Text>
                </TouchableOpacity>

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
        width: '100%',
        height: '10%',
        alignItems: 'center',
        borderBottomColor: '#5D21A7',
        borderBottomWidth: 1,
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
        width: 120,
        height: 120,
        borderRadius: 60,
        borderColor: '#5D21A7',
        borderWidth: 3,
        resizeMode: 'cover',
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

    changePictureText: {
        fontSize: 16,
        color: '#5D21A7',
        marginTop: 10,
    },
});
