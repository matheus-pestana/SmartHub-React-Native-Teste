import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions, ActivityIndicator, Pressable } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function Home() {

  const [videoReady, setVideoReady] = useState(false);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>

        <View style={styles.icons}>
          <Ionicons name="list-outline" size={28} color="white" style={styles.icon} />
        </View>

        <Image
          resizeMode='center'
          style={styles.logo}
          source={require('../assets/logo.png')}
        />

        <View style={styles.icons}>
          <Ionicons name="search-outline" size={28} color="white" style={styles.profileIcon} />
          <Pressable onPress={() => navigation.navigate('Perfil')}>
            <Ionicons name="person-circle" size={28} color="white" style={styles.profileIcon} />
          </Pressable>
        </View>

      </View>

      <View style={styles.mainContainer}>
        <Text style={styles.materia}>Arte</Text>
        <ScrollView style={styles.main} horizontal={true}>

          <YoutubeIframe
            videoId='CV5ZQVaKDRc'
            width={windowWidth * 0.8}
            height={windowHeight * 0.3}
            onReady={() => setVideoReady(true)}
          />

          <YoutubeIframe
            videoId='CV5ZQVaKDRc'
            width={windowWidth * 0.8}
            height={windowHeight * 0.8}
            onReady={() => setVideoReady(true)}
          />

          {!videoReady && <ActivityIndicator color='#5D21A7' />}
        </ScrollView>
      </View>


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

})