import React, { useCallback, useState } from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback, FlatList } from 'react-native'
import { VictoryAxis, VictoryChart, VictoryTheme, VictoryBar, VictoryLabel } from "victory-native";
import Header from '../components/Header'
import { getRealm } from '../services/realm'
import { useFocusEffect } from '@react-navigation/native'
import estilo from '../estilo'
import { RFValue } from "react-native-responsive-fontsize"
import SeparatorFlatList from '../components/SeparatorFlatlist'
import CardRecipeProduced from '../components/CardRecipeProduced'

export default props => {
    const [recipesProduced, setRecipesProduced] = useState([])
    const [changeChartsOrHistoric, setChangeChartsOrHistoric] = useState(false)

    const [total, setTotal] = useState([])


    useFocusEffect(useCallback(() => {
        async function getRecipes() {
            const realm = await getRealm()
            const r = realm.objects('RecipeProduced')
            setRecipesProduced(r)
            r.addListener((values) => {
                setRecipesProduced([...values])
            })


            var recipeProduced = [...r]
            var essenciaqtde = []

            for (let index = 0; index < recipeProduced.length; index++) {
                for (let ind = 0; ind < recipeProduced[index].recipe.percents.length; ind++) {
                    essenciaqtde.push({ name: recipeProduced[index].recipe.essences[ind].name, qtde: recipeProduced[index].recipe.percents[ind] * recipeProduced[index].quantity / 100 })
                }
            }

            var namess = []
            var essenciatotal = []
            var names1 = []


            for (let i = 0; i < essenciaqtde.length; i++) {
                namess.push(essenciaqtde[i].name)
            }
            names1 = [...new Set(namess)]

            for (let e = 0; e < names1.length; e++) {
                var soma = 0
                for (let i = 0; i < essenciaqtde.length; i++) {

                    if (names1[e] == essenciaqtde[i].name) {
                        soma += essenciaqtde[i].qtde
                    }
                }
                essenciatotal.push({ name: names1[e], qtde: soma })
            }

            essenciatotal.sort(function (a, b) {
                if (a.qtde < b.qtde) {
                    return 1;
                }
                if (a.qtde > b.qtde) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });

            setTotal(essenciatotal.slice(0, 8))





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
    }


    return (
        <>
            <Header />
            <View style={styles.container}>

                {/* botao historico - graficos */}
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
                            <View style={{ height: RFValue(70) }}></View>
                        </>
                        :
                        <View>
                            {total ?
                                <View >
                                    <Text style={styles.textCardEssence}>As 7 essências mais consumidas</Text>
                                    <View>
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            domainPadding={25}
                                        >
                                            <VictoryBar
                                                // data={total.filter(essencia => essencia.qtde >= 30)}
                                                data={total.sort()}
                                                x='name' y='qtde'
                                                alignment="middle"
                                                labels={({ datum }) => `${Number(datum._y).toFixed(2)}`}
                                                sortOrder="descending"

                                            />
                                            <VictoryAxis
                                                tickFormat={total.name}
                                                tickLabelComponent={<VictoryLabel angle={-30} textAnchor="end" style={{ fontSize: 8 }} />}
                                            />
                                            {/* <VictoryAxis
                                            dependentAxis
                                            tickFormat={(x) => (`${x}ml`)}
                                        /> */}

                                        </VictoryChart>
                                    </View>

                                </View>

                                : false

                            }


                        </View>
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
        fontFamily: estilo.fonts.negrito,
        textAlign: 'center'
    },
    textCardRecipeBottom: {
        color: estilo.colors.azul,
        backgroundColor: estilo.colors.cinza,
        fontSize: RFValue(15),
        fontFamily: estilo.fonts.padrao
    }
})