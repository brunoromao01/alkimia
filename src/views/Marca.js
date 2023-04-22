import React from 'react'
import { StyleSheet, View, Text } from 'react-native'


export default props => {

    return (

        <View style={styles.container}>
            <Text>Marca</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})