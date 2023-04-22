import React, { useCallback, useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, ScrollView, FlatList } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { RFValue } from "react-native-responsive-fontsize"
import estilo from '../estilo'
import { getRealm } from '../services/realm'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useFocusEffect } from '@react-navigation/native'

export default ({ data, deletingRecipe, producingRecipe, editingRecipe, cloningRecipe }) => {
    const [showFullCard, setShowFullCard] = useState(false)

    const dateFormated = data.createdAt.toLocaleDateString('pt-BR')
    const essencias = data.essences
    const percents = data.percents
    const vg = data.vg
    const pg = data.pg
    const name = data.name

    return (
        <View style={[styles.cardEssence]}>

            <TouchableWithoutFeedback
                onPress={() => setShowFullCard(!showFullCard)}
            >
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '65%' }}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.textCardRecipe, { fontFamily: estilo.fonts.padrao }]}>{name}</Text>
                    </View>
                    <View style={{ width: '30%', alignItems: 'center' }}>
                        <Text style={[styles.textCardRecipe, { fontFamily: estilo.fonts.padrao }]}>{vg}/{pg}</Text>
                    </View>
                    {/* <View style={{ width: '25%', alignItems: 'center', marginRight: RFValue(5) }}>
                    <Text style={[styles.textCardEssence, { fontFamily: estilo.fonts.padrao, textAlign: 'left' }]}>{dateFormat}</Text>

                </View> */}
                    <View style={{ width: '5%', justifyContent: 'center' }}>
                        <Menu>
                            <MenuTrigger customStyles={{ triggerText: { color: estilo.colors.azul } }} text='>' />
                            <MenuOptions>
                                <MenuOption onSelect={() => deletingRecipe(data)}><Text style={{ color: 'black' }}>Deletar</Text></MenuOption>
                                <MenuOption onSelect={() => editingRecipe(data)} ><Text style={{ color: 'black' }}>Editar</Text></MenuOption>
                                <MenuOption onSelect={() => cloningRecipe(data)} ><Text style={{ color: 'black' }}>Clonar</Text></MenuOption>
                                <MenuOption onSelect={() => producingRecipe(data)} ><Text style={{ color: 'black' }}>Produzir</Text></MenuOption>

                            </MenuOptions>
                        </Menu>

                    </View>
                </View>
            </TouchableWithoutFeedback>

            {
                showFullCard ?
                    <>

                        <View style={{ width: '90%', backgroundColor: '#fafafa', marginTop: RFValue(5), paddingVertical: RFValue(5), borderRadius: RFValue(5) }}>
                            <FlatList
                                data={essencias}
                                renderItem={({ item, index }) => (
                                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingHorizontal: RFValue(10) }}>
                                        <View style={{ width: '55%', alignItems: 'flex-start' }}>
                                            <Text style={styles.textCardEssence} adjustsFontSizeToFit numberOfLines={1}>{item.name}</Text>
                                        </View>
                                        <View style={{ width: '35%', alignItems: 'center' }}>
                                            <Text style={styles.textCardEssence} adjustsFontSizeToFit numberOfLines={1}>{item.brand.name}</Text>
                                        </View>
                                        <View style={{ width: '10%', alignItems: 'center' }}>
                                            <Text style={styles.textCardEssence} >{percents[index]}%</Text>
                                        </View>
                                    </View>
                                )
                                }
                            />
                        </View>
                        {/* <View style={{ justifyContent: 'flex-end', backgroundColor: '#fff', alignItems: 'flex-end', width: '40%', paddingRight: RFValue(10), paddingVertical: RFValue(5) }}>

                                <Text style={styles.textCardEssence}>Criado:</Text>
                                <Text style={styles.textCardEssence}>{dateFormated}</Text>
                            </View> */}

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
})