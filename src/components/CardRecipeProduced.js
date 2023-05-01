import React, { useCallback, useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, ScrollView, FlatList, Image } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { RFValue } from "react-native-responsive-fontsize"
import estilo from '../estilo'
import { getRealm } from '../services/realm'
import Fontisto from 'react-native-vector-icons/Fontisto'
import SelectDropdown from 'react-native-select-dropdown'
import { useFocusEffect } from '@react-navigation/native'
import moment from 'moment'
import 'moment/locale/pt-br'

export default ({ data, saveRating }) => {
    const [showFullRecipe, setShowFullRecipe] = useState(true)
    const [configPG, setConfigPg] = useState(0)
    const [configVG, setConfigVg] = useState(0)
    const datavencimentodescanso = moment(data.createdAt).add(1, 'days').calendar()
    const mesVencimento = moment(data.createdAt).add(data.months, 'months').format('MM/YYYY');
    var receita = data.recipe.essences
    var percentuais = data.recipe.percents
    var essenciasepercentuais = []
    var gramaTotal = 0
    var custoTotal = 0
    var pgPercent = 0
    var pgMl = 0
    const mlVg = data.quantity * data.recipe.vg / 100
    const custoVg = mlVg * data.recipe.essenceVg.price
    const gramasVg = mlVg * Number(configVG)
    gramaTotal = Number(gramaTotal) + Number(gramasVg)
    custoTotal = Number(custoTotal) + Number(custoVg)


    pgPercent = 100 - data.recipe.vg
    pgMl = data.quantity - mlVg
    var pgCusto = 0
    data.recipe.percents.map((percent) => {
        pgPercent -= percent
        pgMl -= Number(percent * data.quantity / 100)
    })
    pgCusto = pgMl * data.recipe.essencePg.price

    const mlPg = pgMl.toFixed(2)
    const gramasPg = (mlPg * Number(configPG)).toFixed(2)
    gramaTotal = Number(gramaTotal) + Number(gramasPg)
    custoTotal = Number(custoTotal) + Number(pgCusto)

    receita.map((element, index) => {
        essenciasepercentuais.push({ essencia: element, percentual: percentuais[index], quantidade: data.quantity })
        gramaTotal += Number((percentuais[index] * data.quantity / 100) * Number(configPG))
        custoTotal += Number((percentuais[index] * data.quantity / 100) * element.price)

    });

    useFocusEffect(useCallback(() => {
        try {
            async function getEssences() {
                const realm = await getRealm()
                const config = realm.objects('Config')
                setConfigPg(config[0].pgDefault)
                setConfigVg(config[0].vgDefault)
            }
            getEssences()
        } catch {

        }

    }))




    return (
        <View style={styles.cardEssence}>
            <View style={{ flexDirection: 'row', paddingBottom: RFValue(10) }}>
                <View style={{ width: '50%' }}>
                    <Text style={styles.textCardRecipe}>{data.recipe.name}</Text>
                </View>
                <View style={{ width: '40%' }}>
                    <Text style={styles.textCardRecipe}>{(data.quantity).toFixed(2)}ml</Text>
                </View>
                <View style={{ width: '10%', alignItems: 'center',  }}>
                    <TouchableWithoutFeedback onPress={() => setShowFullRecipe(!showFullRecipe)}>
                        <Fontisto name='angle-down' size={RFValue(15)} color={estilo.colors.azul} />
                    </TouchableWithoutFeedback>
                </View>
            </View>
            {
                showFullRecipe ?
                    <View>
                        <View style={{ flexDirection: 'row', backgroundColor: '#fafafa', paddingVertical: RFValue(5) }}>
                            <View style={{ width: '44%', justifyContent: 'center', alignItems: 'flex-start' }}><Text style={styles.textCardEssenceBold}>Ingrediente</Text></View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}><Text style={styles.textCardEssenceBold}>%</Text></View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}><Text style={styles.textCardEssenceBold}>ml</Text></View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}><Text style={styles.textCardEssenceBold}>g</Text></View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}><Text style={styles.textCardEssenceBold}>$</Text></View>

                        </View>

                        {/* VG */}
                        <View style={{ flexDirection: 'row', backgroundColor: '#fafafa', }}>
                            <View style={{ width: '44%', justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={styles.textCardEssence}>VG - {data.recipe.essenceVg.brand.name}</Text></View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textCardEssence}>{data.recipe.vg}</Text></View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textCardEssence}>{mlVg.toFixed(2)}</Text></View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textCardEssence}>{gramasVg.toFixed(2)}</Text></View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textCardEssence}>{custoVg.toFixed(2)}</Text></View>
                        </View>

                        {/* PG */}
                        <View style={{ flexDirection: 'row', backgroundColor: '#fafafa', }}>
                            <View style={{ width: '44%', justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={styles.textCardEssence}>PG - {data.recipe.essencePg.brand.name}</Text></View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textCardEssence}>{pgPercent}</Text></View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textCardEssence}>{mlPg}</Text></View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textCardEssence}>{gramasPg}</Text></View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textCardEssence}>{pgCusto.toFixed(2)}</Text></View>

                        </View>
                        <FlatList
                            data={essenciasepercentuais}
                            renderItem={({ item }) => {

                                const quantity = item.quantidade
                                const ml = item.percentual / 100 * quantity
                                const g = ml * Number(configPG)
                                const rs = item.essencia.price * ml

                                return (
                                    <View style={{ flexDirection: 'row', backgroundColor: '#fafafa' }}>
                                        <View style={{ width: '44%', justifyContent: 'center', alignItems: 'flex-start' }}>
                                            <Text adjustsFontSizeToFit numberOfLines={1} style={styles.textCardEssence}>{item.essencia.name} - {item.essencia.brand.name} </Text>
                                        </View>
                                        <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.textCardEssence}>{item.percentual} </Text>
                                        </View>
                                        <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.textCardEssence}>{ml.toFixed(2)} </Text>
                                        </View>
                                        <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.textCardEssence}>{g.toFixed(2)} </Text>
                                        </View>
                                        <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.textCardEssence}>{rs.toFixed(2)} </Text>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                        <View style={{ flexDirection: 'row', backgroundColor: '#fafafa', paddingBottom: RFValue(5), borderRadius: RFValue(3) }}>
                            <View style={{ width: '44%', justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={styles.textCardEssenceBold}>Total</Text>
                            </View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textCardEssenceBold}>100</Text>
                            </View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textCardEssenceBold}>{data.quantity} </Text>
                            </View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textCardEssenceBold}>{gramaTotal.toFixed(2)}</Text>
                            </View>
                            <View style={{ width: '14%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.textCardEssenceBold}>{custoTotal.toFixed(2)} </Text>
                            </View>
                        </View>

                    </View>
                    : false
            }

            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: RFValue(5) }}>
                <View style={{ width: '45%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: RFValue(25), height: RFValue(25) }} source={require('../assets/colorIcon/day.png')} />
                    <Text style={[styles.textCardRecipeBottom, { marginLeft: RFValue(5) }]} adjustsFontSizeToFit numberOfLines={1}>{datavencimentodescanso}</Text>
                </View>
                <View style={{ width: '30%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginLeft: RFValue(5) }}>
                    <Image style={{ width: RFValue(25), height: RFValue(25) }} source={require('../assets/colorIcon/schedule.png')} />
                    <Text style={[styles.textCardRecipeBottom, { marginLeft: RFValue(5) }]}>{mesVencimento}</Text>
                </View>
                <View style={{ width: '25%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ marginRight: RFValue(3) }}>
                            <Fontisto name='star' size={RFValue(18)} color={'#FAB32F'} />
                        </View>
                        <SelectDropdown
                            data={[1, 2, 3, 4, 5]}
                            onSelect={(selectedItem, index) => {
                                saveRating(data._id, selectedItem)
                            }}
                            buttonStyle={{ width: RFValue(25), borderRadius: RFValue(1), height: RFValue(25), borderRadius: RFValue(5), alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}
                            // buttonTextStyle={{alignSelf: 'center',}}
                            renderCustomizedButtonChild={(selectedItem, index) => {
                                return (
                                    <View style={{ width: RFValue(25) }}>
                                        <Text style={styles.textCardEssence}>{selectedItem ? selectedItem : data.rating}</Text>
                                    </View>
                                );
                            }}
                            renderCustomizedRowChild={(item, index) => {
                                return (
                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: RFValue(20), height: RFValue(15), }}>
                                        <Text style={styles.textCardEssence} >{item}</Text>
                                    </View>
                                );
                            }}
                            rowStyle={{ height: RFValue(30) }}
                            buttonTextAfterSelection={selectedItem => selectedItem}
                            defaultButtonText={'0'}

                        />
                    </View>



                </View>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    cardEssence: {
        width: '100%',
        backgroundColor: estilo.colors.cinza,

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
    textCardEssenceBold: {
        color: estilo.colors.azul,
        fontFamily: estilo.fonts.negrito
    },
    textCardRecipeBottom: {
        color: estilo.colors.azul,
        backgroundColor: estilo.colors.cinza,
        fontSize: RFValue(15),
        fontFamily: estilo.fonts.padrao
    }
})