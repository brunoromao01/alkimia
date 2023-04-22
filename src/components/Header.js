import React from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import estilo from '../estilo'

export default props => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>ALKIMIA</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height * 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: estilo.colors.azul,
        // marginBottom: 20,
        width: '100%'
    },
    title: {
        color: estilo.colors.laranja,
        fontSize: 35,
        fontFamily: 'fbsbltc'
    }
})