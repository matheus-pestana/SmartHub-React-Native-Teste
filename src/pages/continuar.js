import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Salvos() {

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
                    <Ionicons name="person-circle" size={28} color="white" style={styles.profileIcon} />
                </View>

            </View>
            <View style={styles.content}>
                <Text style={styles.text}>Em breve...</Text>
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

})