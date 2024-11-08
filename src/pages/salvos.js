import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, SafeAreaView, Image, ActivityIndicator, Pressable, TextInput, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, doc, onSnapshot, arrayRemove, updateDoc } from 'firebase/firestore';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();

export default function SalvosScreen() {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [videosSalvos, setVideosSalvos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                // Se o usuário não estiver logado, redireciona para a tela de Login
                navigation.navigate('Login');
            } else {
                // Se o usuário estiver logado, busca os vídeos salvos
                const userId = user.uid;
                const db = getFirestore();
                const userRef = doc(db, 'users', userId);

                const unsubscribeUser = onSnapshot(userRef, (userSnap) => {
                    if (userSnap.exists()) {
                        const { salvos } = userSnap.data();
                        setVideosSalvos(salvos || []);
                    }
                    setLoading(false);
                });

                // Limpeza da snapshot do Firestore
                return () => unsubscribeUser();
            }
        });

        // Limpeza do listener de autenticação
        return () => unsubscribeAuth();
    }, [navigation]);

    const handleVideoPress = (video) => {
        setSelectedVideo(video);
        setModalVisible(true);
    };

    const renderVideoItem = ({ item }) => (
        <Pressable onPress={() => handleVideoPress(item)} style={styles.videoContainer}>
            <Video
                source={{ uri: item.videoUrl }}
                style={styles.video}
                useNativeControls
                resizeMode="contain"
            />
            <Text style={styles.videoTitle}>{item.title}</Text>
        </Pressable>
    );

    const handleRemoveVideo = async () => {
        if (!selectedVideo) return;

        try {
            const userId = auth.currentUser.uid;
            const db = getFirestore();
            const userRef = doc(db, 'users', userId);

            await updateDoc(userRef, {
                salvos: arrayRemove(selectedVideo)
            });

            setVideosSalvos((prevVideos) =>
                prevVideos.filter(video => video.videoId !== selectedVideo.videoId)
            );

            setModalVisible(false);
            setSelectedVideo(null);
        } catch (error) {
            console.error("Erro ao remover vídeo:", error);
        }
    };

    const renderModal = () => (
        <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {selectedVideo ? (
                        <>
                            <Video
                                source={{ uri: selectedVideo.videoUrl }}
                                style={styles.modalVideo}
                                resizeMode="contain"
                                useNativeControls
                            />
                            <Text style={styles.modalTitle}>{selectedVideo.title}</Text>
                            <Pressable onPress={handleRemoveVideo} style={styles.removeButton}>
                                <Ionicons name="trash-bin-outline" size={24} color="white" />
                            </Pressable>
                            <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                <Ionicons name="close-circle" size={32} color="white" />
                            </Pressable>
                        </>
                    ) : (
                        <ActivityIndicator size="large" color="#0000ff" />
                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <View style={styles.icons}>
                    <Pressable>
                        <Ionicons name="list-outline" size={28} color="black" style={styles.icon} />
                    </Pressable>
                </View>

                <Image
                    resizeMode='center'
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                />

                <View style={styles.icons}>
                    <Pressable>
                        <Ionicons name="search-outline" size={28} color="black" style={styles.profileIcon} />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('Perfil')}>
                        <Ionicons name="person-circle" size={28} color="white" style={styles.profileIcon} />
                    </Pressable>
                </View>
            </View>

            <View style={styles.videos}>
                {loading ? (
                    <ActivityIndicator size="large" color="#5D21A7" />
                ) : videosSalvos.length === 0 ? (
                    <Text style={styles.noVideosText}>Não há nenhum vídeo salvo</Text>
                ) : (
                    <FlatList
                        data={videosSalvos}
                        keyExtractor={(item) => item.videoId}
                        renderItem={renderVideoItem}
                    />
                )}
            </View>

            {/* Render Modal */}
            {renderModal()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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

    icons: {
        width: '20%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
    },

    searchInput: {
        height: 40,
        borderColor: '#5D21A7',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        color: 'white',
        margin: 10,
        backgroundColor: 'black',
    },

    container: {
        paddingVertical: 30,
        backgroundColor: 'black',
        flex: 1,
    },

    videos: {
        padding: 20,
        justifyContent: 'center',
    },

    videoContainer: {
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: '#5D21A7',
        padding: 10,
    },

    video: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },

    videoTitle: {
        color: 'white',
        textAlign: 'center',
        marginTop: 10,
    },

    noVideosText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    removeButton: {
        backgroundColor: '#D32F2F',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },

    closeButton: {
        backgroundColor: '#5D21A7',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
});
