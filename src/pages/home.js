import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Dimensions, ActivityIndicator, Pressable, TextInput, FlatList, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video, ResizeMode } from 'expo-av';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { storage } from '../../firebaseConfig';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getAuth } from 'firebase/auth';

const auth = getAuth(); // Inicializa o objeto de autenticação


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
  const [item, setItem] = useState([]);
  const videoRefs = useRef([]);
  const route = useRoute();
  const { category } = route.params || { category: 'todas' };
  const navigation = useNavigation();

  useEffect(() => {
    fetchVideos(category).then(() => {
      const groupedVideos = groupVideosByCategory(allVideos);
      setVideos(groupedVideos);
    });
  }, [category]);

  const groupVideosByCategory = (videos) => {
    return videos.reduce((acc, video) => {
      (acc[video.category] = acc[video.category] || []).push(video);
      return acc;
    }, {});
  };

  const saveVideo = async (video) => {
    const user = auth.currentUser;
  
    if (!user) {
      console.error('Usuário não autenticado. Não é possível salvar o vídeo.');
      return; // Sai da função se o usuário não estiver autenticado
    }
  
    const userId = user.uid;
    const db = getFirestore();
    const userRef = doc(db, 'users', userId);
  
    try {
      await updateDoc(userRef, {
        salvos: arrayUnion({
          videoId: video.name,
          videoUrl: video.url,
          title: video.name
        })
      });
      Alert.alert('Vídeo salvo com sucesso!')
      console.log('Vídeo salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error);
    }
  };
  

  const fetchVideos = async (selectedCategory) => {
    setLoading(true);
    try {
      const categories = ['arte', 'matematica', 'portugues', 'fisica'];
      let allFetchedVideos = [];

      const categoriesToFetch = selectedCategory === 'todas' ? categories : [selectedCategory];

      for (const category of categoriesToFetch) {
        const listRef = ref(storage, `videos/${category}/`); // Acessa a pasta correta com base na categoria
        const res = await listAll(listRef);

        const videoUrls = await Promise.all(
          res.items.map(async (itemRef) => {
            try {
              const url = await getDownloadURL(itemRef);
              return { name: itemRef.name, url, category }; // Adiciona a categoria aqui para uso posterior
            } catch (error) {
              console.error(`Erro ao obter URL do vídeo ${itemRef.name}:`, error);
            }
          })
        );

        allFetchedVideos = [...allFetchedVideos, ...videoUrls.filter((video) => video)];
      }

      setAllVideos(allFetchedVideos);
      if (selectedCategory === 'todas') {
        setVideos(allFetchedVideos);
      } else {
        // Filtra vídeos pela categoria que corresponde à pasta
        setVideos(allFetchedVideos.filter(video => video.category === selectedCategory));
      }
    } catch (error) {
      console.error('Erro ao carregar vídeos:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos(category); // Carrega vídeos para a categoria selecionada
  }, [category]);

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
      case Video.FULLSCREEN_UPDATE_PLAYER_WILL_PRESENT:
        // Desbloqueia e força a tela para o modo paisagem ao entrar no modo tela cheia
        await ScreenOrientation.unlockAsync();
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        break;
      case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
        await ScreenOrientation.unlockAsync();
        break;
      case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
        // Ao sair do modo tela cheia, volta para o modo retrato
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        break;
      default:
        break;
    }
  };

  const handleOpenModal = (index) => {
    setSelectedVideo(videos[index]);
    setModalVisible(true);
  };

  const handleCloseModal = async () => {
    setModalVisible(false);
    setSelectedVideo(null);
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  };

  const renderVideoPreview = ({ item, index }) => (
    <View style={styles.thumbnailContainer}>
      <Pressable onPress={() => handleOpenModal(index)} style={styles.thumbnailContainer}>
        <Video
          source={{ uri: item.url }}
          style={styles.thumbnail}
          resizeMode={ResizeMode.COVER}
          shouldPlay={false}
          isMuted={true}
          useNativeControls={false}
        />
      </Pressable>
    </View>
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
              <Pressable onPress={() => saveVideo(selectedVideo)} style={styles.saveButton}>
                <Ionicons name="bookmark-outline" size={24} color="white" />
              </Pressable>
              <Pressable onPress={handleCloseModal} style={styles.closeButton}>
                <Ionicons name="close-circle-outline" size={32} color="white" />
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
    paddingVertical: 30,
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

  thumbnailContainer: {
    marginHorizontal: 10,
    width: 150,
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#222',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    margin: 10,
  },

  thumbnail: {
    width: '100%',
    height: '100%',
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

  saveButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    borderRadius: 999,
    backgroundColor: '#5D21A7',
    padding: 5,
    borderRadius: 999,
    borderWidth: 1,
    color: 'white',
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 999,
    backgroundColor: '#5D21A7',
    borderRadius: 999,
    borderWidth: 1,
    color: 'white',
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