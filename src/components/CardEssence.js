import React, { useState } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback,Image } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize"
import estilo from '../estilo'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

export default props => {
    const [showFullCard, setShowFullCard] = useState(false)

    return (
        <View style={[styles.cardEssence]}>

            <TouchableWithoutFeedback
                onPress={() => setShowFullCard(!showFullCard)}
            >
                <View style={{ width: '100%', flexDirection: 'row' }}>

                    <View style={{ width: '45%' }}>
                        <Text style={styles.textCardEssence}>{props.item.name}</Text>
                    </View>
                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <Text style={styles.textCardEssence}>{props.item.brand.name}</Text>
                    </View>
                    <View style={{ width: '20%', alignItems: 'center', marginRight: RFValue(5) }}>
                        <Text style={styles.textCardEssence}>{props.item.quantity}</Text>
                    </View>
                    <View style={{ width: '5%' }}>
                        <Menu>
                            <MenuTrigger customStyles={{ triggerText: { color: estilo.colors.azul } }} text='>' />
                            <MenuOptions>
                                <MenuOption onSelect={() => props.confirmDeletion(props.item)}>
                                    <Text style={{ color: 'black' }}>Deletar</Text>
                                </MenuOption>
                                <MenuOption onSelect={() => props.updateEssence(props.item)}  >
                                    <Text style={{ color: 'black' }}>Editar</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>

                </View>
            </TouchableWithoutFeedback>

            {
                showFullCard ?
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: RFValue(5) }}>
                            <View style={{ width: '35%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Image style={{ width: RFValue(25), height: RFValue(25) }} source={require('../assets/colorIcon/delivery-truck.png')} />
                                <Text style={[styles.textCardEssence, { marginLeft: RFValue(5) }]} adjustsFontSizeToFit numberOfLines={1}>{props.item.suplier.name}</Text>
                            </View>
                            <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginLeft: RFValue(5) }}>
                                <Image style={{ width: RFValue(25), height: RFValue(25) }} source={require('../assets/colorIcon/salt-and-pepper.png')} />
                                <Text style={[styles.textCardEssence, { marginLeft: RFValue(5) }]} adjustsFontSizeToFit numberOfLines={1}>{props.item.taste}</Text>
                            </View>
                            <View style={{ width: '35%', flexDirection: 'row', justifyContent: 'flex-end', marginRight: RFValue(10),alignItems: 'center', }}>
                                <Image style={{ width: RFValue(25), height: RFValue(25) }} source={require('../assets/colorIcon/cash.png')} />
                                <Text style={[styles.textCardEssence, { marginLeft: RFValue(5) }]}>{props.item.price}(p/ml)</Text>
                            </View>
                         
                        </View>
                    </>
                    : false
            }

        </View>
    )
}
const styles = StyleSheet.create({
    cardEssence: {
        width: '100%',
        backgroundColor: estilo.colors.cinza,
        borderRadius: RFValue(5),
        padding: RFValue(10),
        elevation: 1,
    },
    textCardRecipe: {
        color: estilo.colors.azul,
        backgroundColor: estilo.colors.cinza,
        fontSize: RFValue(20),
        fontFamily: estilo.fonts.padrao
    },
    textCardEssence: {
        color: estilo.colors.azul,
        fontFamily: estilo.fonts.padrao
    },
    textCardRecipeBottom: {
        color: estilo.colors.azul,
        backgroundColor: estilo.colors.cinza,
        fontSize: RFValue(15),
        fontFamily: estilo.fonts.padrao
    }
})