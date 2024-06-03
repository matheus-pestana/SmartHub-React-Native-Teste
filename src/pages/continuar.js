import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Salvos() {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <Image
                    resizeMode='center'
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                />
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