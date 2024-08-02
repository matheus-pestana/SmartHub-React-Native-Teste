import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions, ActivityIndicator } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import * as ScreenOrientation from 'expo-screen-orientation';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function Home() {

  const [videoReady, setVideoReady] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Image
          resizeMode='center'
          style={styles.logo}
          source={require('../assets/logo.png')}
        />
      </View>
      <View>
        <YoutubeIframe
          videoId='HKKEqzDaaDs'
          width={windowWidth}
          height={windowHeight}
          onReady={() => setVideoReady(true)}
        />
        {!videoReady && <ActivityIndicator color='#5D21A7'/>}
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
    width: '100%',
    height: '10%',
    alignItems: 'center',
    borderBottomColor: '#5D21A7',
    borderBottomWidth: 1,
  },

  logo: {
    width: '80%',
    height: '80%',
  },

})