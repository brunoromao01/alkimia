import React, { useCallback, useState } from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback, FlatList } from 'react-native'
import Header from '../components/Header'
import { getRealm } from '../services/realm'
import { useFocusEffect } from '@react-navigation/native'
import estilo from '../estilo'
import { RFValue } from "react-native-responsive-fontsize"
import SeparatorFlatList from '../components/SeparatorFlatlist'
import CardRecipeProduced from '../components/CardRecipeProduced'

export default props => {
    const [recipesProduced, setRecipesProduced] = useState([])
    const [changeChartsOrHistoric, setChangeChartsOrHistoric] = useState([])

    useFocusEffect(useCallback(() => {
        async function getRecipes() {
            const realm = await getRealm()
            const r = realm.objects('RecipeProduced')
            setRecipesProduced(r)
            r.addListener((values) => {
                setRecipesProduced([...values])
            })
            return () => {
                r.removeAllListeners()
            }
        }
        getRecipes()
    }, []))

    const saveRating = async (id, star) => {
        const realm = await getRealm()
        const r = realm.objectForPrimaryKey('RecipeProduced', id)
        realm.write(() => {
            r.rating = star
        })
        console.log(r)
    }


    return (
        <>
            <Header />
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', width: '100%', marginVertical: RFValue(20), paddingHorizontal: RFValue(20) }}>

                    <TouchableWithoutFeedback onPress={() => setChangeChartsOrHistoric(true)}>
                        <View style={{ width: '50%', alignItems: 'center', borderBottomWidth: changeChartsOrHistoric ? 3 : 1, borderColor: changeChartsOrHistoric ? estilo.colors.azul : '#666' }}>
                            <Text style={[styles.buttonText, { fontFamily: estilo.fonts.padrao, color: changeChartsOrHistoric ? estilo.colors.azul : '#666' }]}>
                                Histórico
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => setChangeChartsOrHistoric(false)}>
                        <View style={{ width: '50%', alignItems: 'center', borderBottomWidth: changeChartsOrHistoric ? 1 : 3, borderColor: changeChartsOrHistoric ? '#666' : estilo.colors.azul }}>
                            <Text style={[styles.buttonText, { fontFamily: estilo.fonts.padrao, color: changeChartsOrHistoric ? '#666' : estilo.colors.azul }]}>
                                Gráficos
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>

                </View>
                {
                    changeChartsOrHistoric ?
                        <>
                            <FlatList
                                data={recipesProduced}
                                keyExtractor={item => item._id}
                                ItemSeparatorComponent={<SeparatorFlatList />}
                                renderItem={({ item }) => <CardRecipeProduced data={item} saveRating={saveRating} />}
                            />
                            <View style={{height: RFValue(70)}}></View>
                        </>
                        : <Text></Text>
                }


            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    buttonText: {
        color: estilo.colors.azul,
        fontSize: RFValue(16),
        fontFamily: estilo.fonts.negrito,

    },
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
    textCardRecipeBottom: {
        color: estilo.colors.azul,
        backgroundColor: estilo.colors.cinza,
        fontSize: RFValue(15),
        fontFamily: estilo.fonts.padrao
    }
})