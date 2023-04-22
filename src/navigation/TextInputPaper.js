import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { TextInput } from 'react-native-paper'
import estilo from '../estilo'


export default props => {
    const [value, setValue] = useState()

    return (
        <>

            <TextInput
                mode='outlined'
                label= {props.label}
                outlineColor= "transparent"
                activeOutlineColor= {estilo.colors.azul}
                selectionColor= '#999'
                value={value}
                onChangeText={value => props.state(value)}

            />
        </>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})