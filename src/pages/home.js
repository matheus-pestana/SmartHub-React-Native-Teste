import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, ActivityIndicator, Pressable, TextInput, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig';
import * as ScreenOrientation from 'expo-screen-orientation';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Home() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [allVideos, setAllVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);
  const route = useRoute();
  const { category = 'todas' } = route.params || {};

  const navigation = useNavigation();

  const fetchVideos = async (category = '') => {
    setLoading(true);
    try {
      const categories = ['arte', 'matematica', 'fisica'];
      let allFetchedVideos = [];

      const categoriesToFetch = category ? [category] : categories;

      for (const category of categoriesToFetch) {
        const listRef = ref(storage, `videos/${category}/`);
        const res = await listAll(listRef);

        const videoUrls = await Promise.all(
          res.items.map(async (itemRef) => {
            try {
              const url = await getDownloadURL(itemRef);
              const nameWithoutExtension = itemRef.name.replace(/\.[^/.]+$/, '');
              return { name: nameWithoutExtension, url, category };
            } catch (error) {
              console.error(`Erro ao obter URL do vídeo ${itemRef.name}:`, error);
            }
          })
        );

        allFetchedVideos = [...allFetchedVideos, ...videoUrls.filter((video) => video)];
      }

      setAllVideos(allFetchedVideos);

      if (category) {
        setVideos(allFetchedVideos.filter((video) => video.category === category));
      } else {
        setVideos(allFetchedVideos);
      }
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (category === 'todas') {
      setVideos(allVideos);
    } else {
      setVideos(allVideos.filter(video => video.category === category));
    }
  }, [category, allVideos]);

  const handlePlayPause = async (index) => {
    const videoRef = videoRefs.current[index];
    if (videoRef) {
      const videoStatus = await videoRef.getStatusAsync();
      if (videoStatus.isPlaying) {
        await videoRef.pauseAsync();
      } else {
        await videoRef.playAsync();
      }
    }
  };

  const onFullscreenUpdate = async ({ fullscreenUpdate }) => {
    switch (fullscreenUpdate) {
      case 0 || 1:
        await ScreenOrientation.unlockAsync();
        break;
      case 2 || 3:
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
        break;
    }
  };

  const handleOpenModal = (index) => {
    setSelectedVideo(videos[index]);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedVideo(null);
  };

  const renderVideoPreview = ({ item, index }) => (
    <Pressable onPress={() => handleOpenModal(index)} style={styles.thumbnailContainer}>
      <Video
        source={{ uri: item.url }}
        style={styles.thumbnail}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={false}
        isMuted={true}
        useNativeControls={false}
      />
      <Text style={styles.videoTitle} numberOfLines={1}>
        {item.name}
      </Text>
    </Pressable>
  );

  const renderModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {selectedVideo ? (
            <>
              <Video
                source={{ uri: selectedVideo.url }}
                style={styles.modalVideo}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                onFullscreenUpdate={onFullscreenUpdate}
              />
              <Text style={styles.modalTitle}>{selectedVideo.name}</Text>

              {/* Ícone de salvar no modal */}
              <Pressable onPress={() => saveVideo(selectedVideo)} style={styles.saveButton}>
                <Ionicons name="bookmark-outline" size={24} color="white" />
              </Pressable>

              <Pressable onPress={handleCloseModal} style={styles.closeButton}>
                <Ionicons name="close-circle" size={32} color="#5D21A7" />
              </Pressable>
            </>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
      </View>
    </Modal>
  );

  const saveVideo = async (video) => {
    const userId = 'usuario_id';  // Pegar o ID do usuário logado. Ajuste conforme sua autenticação.

    // Referência para o documento do usuário na coleção 'users'
    const userRef = doc(db, 'users', userId);

    // Cria uma referência para o vídeo na subcoleção 'videos' do usuário
    const videoRef = doc(userRef, 'videos', video.name);

    // Verifica se o documento do usuário existe
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert('Usuário não encontrado.');
      return;
    }

    // Verifica se o vídeo já foi salvo
    const videoSnap = await getDoc(videoRef);

    if (!videoSnap.exists()) {
      // Se o vídeo não existir, salva na subcoleção do usuário
      await setDoc(videoRef, {
        name: video.name,
        url: video.url,
        category: video.category,
        savedAt: new Date().toISOString(), // Adiciona a data de salvamento
      });
      alert('Vídeo salvo com sucesso!');
    } else {
      alert('Este vídeo já foi salvo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.icons}>
          <Pressable onPress={() => navigation.openDrawer()}>
            <Ionicons name="list-outline" size={28} color="white" style={styles.icon} />
          </Pressable>
        </View>

        <Image
          resizeMode='center'
          style={styles.logo}
          source={require('../assets/logo.png')}
        />

        <View style={styles.icons}>
          <Pressable onPress={() => setSearchVisible(!searchVisible)}>
            <Ionicons name="search-outline" size={28} color="white" style={styles.profileIcon} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Perfil')}>
            <Ionicons name="person-circle" size={28} color="white" style={styles.profileIcon} />
          </Pressable>
        </View>
      </View>

      {searchVisible && (
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar..."
          placeholderTextColor="#ccc"
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />
      )}

      <View style={styles.container}>

        {loading ? (

          <ActivityIndicator size="large" color="#5D21A7" />

        ) : (

          <FlatList
            data={videos}
            renderItem={renderVideoPreview}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            contentContainerStyle={styles.videoList}
            ListFooterComponent={() => (
              loading && <ActivityIndicator size="large" color="#0000ff" />
            )}
          />
        )}
      </View>

      {renderModal()}

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({



  controls: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 30,
  },

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

  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  main: {
    width: '90%',
    height: '10%',
    flexGrow: 1,
    flex: 1,
  },

  materia: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingHorizontal: 20,
  },

  scrollContainer: {
    flex: 1,
    alignItems: "center",
  },

  videoTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 5,
  },

  thumbnailContainer: {
    marginHorizontal: 10,
    width: windowWidth * 0.45,
    height: windowWidth * 0.25 + 30,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    margin: 10,
    alignItems: 'center',
  },

  thumbnail: {
    width: '100%',
    height: windowWidth * 0.25,  // Define uma altura proporcional
    borderWidth: 1,
    borderColor: '#5D21A7',
    borderRadius: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },

  saveButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderColor: '#5D21A7',
    borderWidth: 2,
    borderRadius: 999,
    backgroundColor: '#5D21A7',
    padding: 5,
  },

  modalContent: {
    width: '90%',
    height: '60%',
    backgroundColor: '#222',
    borderRadius: 10,
    overflow: 'hidden',
  },

  modalVideo: {
    width: '100%',
    height: '80%',
  },

  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    padding: 10,
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderColor: '#5D21A7',
    borderWidth: 2,
    borderRadius: 999,
    // padding: 10,
  },

  videoList: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  videoContainer: {
    marginHorizontal: 10,
    width: 150,
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },

  video: {
    width: '100%',
    height: '75%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
  },

  controlButton: {
    backgroundColor: '#5D21A7',
    padding: 10,
    borderRadius: 5,
  },

  picker: {
    height: 50,
    width: 200,
    alignSelf: 'center',
    marginBottom: 20,
    color: 'white',
  },

});