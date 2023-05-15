import React, { useCallback, useState } from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback, FlatList, TouchableOpacity, ScrollView, ImageBackground, Dimensions } from 'react-native'
import { VictoryAxis, VictoryChart, VictoryTheme, VictoryBar, VictoryLabel, VictoryLegend } from "victory-native";
import Header from '../components/Header'
import { getRealm } from '../services/realm'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import estilo from '../estilo'
import { RFValue } from "react-native-responsive-fontsize"
import SeparatorFlatList from '../components/SeparatorFlatlist'
import CardRecipeProduced from '../components/CardRecipeProduced'

export default props => {
    const navigation = useNavigation()
    const [recipesProduced, setRecipesProduced] = useState([])
    const [changeChartsOrHistoric, setChangeChartsOrHistoric] = useState(true)
    const [total, setTotal] = useState([])
    const [custo, setCustoTotal] = useState([])

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
            var custoTotal = []
            var soma = 0
            for (let index = 0; index < recipeProduced.length; index++) {
                custoReceita = []
                var percentPg = 0
                soma = 0

                for (let ind = 0; ind < recipeProduced[index].percents.length; ind++) {
                    essenciaqtde.push({ name: recipeProduced[index].essencesNames[ind], qtde: recipeProduced[index].percents[ind] * recipeProduced[index].quantity / 100 })
                    soma += (recipeProduced[index].percents[ind] * recipeProduced[index].quantity / 100) * recipeProduced[index].essencesPrices[ind]
                    percentPg += recipeProduced[index].percents[ind]
                }
                soma += recipeProduced[index].recipe.essenceVg.price * (recipeProduced[index].recipe.vg * recipeProduced[index].quantity / 100)
                soma += recipeProduced[index].recipe.essencePg.price * ((recipeProduced[index].recipe.pg - percentPg) * recipeProduced[index].quantity / 100)
                custoTotal.push({ custo: (soma / recipeProduced[index].quantity).toFixed(2), nome: recipeProduced[index].recipe.name })
            }


            custoTotal.sort(function (a, b) {
                if (a.custo > b.custo) {
                    return 1;
                }
                if (a.custo < b.custo) {
                    return -1;
                }

                return 0;
            });

            setCustoTotal(custoTotal)

            //grafico essencias mais consumidas
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
            setTotal(essenciatotal.slice(0, 11))
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
                    recipesProduced.length < 1 ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, paddingHorizontal: '5%' }}>
                            <Text style={{ fontStyle: estilo.fonts.negrito, fontSize: RFValue(20), color: estilo.colors.azul, paddingBottom: RFValue(20) }}>Não há registros de receitas produzidas.  </Text>
                            <View style={{ width: '100%' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('press')
                                        navigation.navigate('Recipe')
                                    }}
                                >
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>Produzir Receita</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {/* <ImageBackground
                                source={require('../assets/background/prancheta.jpg')}
                                style={{ width: '100%', height: '100%', borderWidth: 1 }}
                                resizeMode='contain'
                            /> */}
                        </View>
                        : false
                }

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
                        <>
                            <ScrollView>
                                {total.length > 0 ?
                                    <>
                                        <View >

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
                                                        style={{ data: { fill: estilo.colors.laranja } }}
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
                                            <Text style={styles.textCardEssence}>Essências mais consumidas</Text>
                                        </View>
                                    </>
                                    : false
                                }
                                {custo.length > 0 ?
                                    <>
                                        <View >

                                            <View>
                                                <VictoryChart
                                                    theme={VictoryTheme.material}
                                                    domainPadding={25}
                                                >
                                                    <VictoryBar
                                                        // data={custo.filter(essencia => essencia.qtde >= 30)}
                                                        data={custo.sort()}
                                                        x='nome' y='custo'
                                                        alignment="middle"
                                                        labels={({ datum }) => `${Number(datum.custo).toFixed(2)}`}
                                                        style={{ data: { fill: estilo.colors.laranja } }}
                                                        sortOrder="descending"
                                                    />
                                                    <VictoryAxis
                                                        tickFormat={total.name}
                                                        tickLabelComponent={<VictoryLabel angle={-15} textAnchor="end" style={{ fontSize: 8 }} />}
                                                    />
                                                    <VictoryAxis
                                                        dependentAxis
                                                        tickFormat={(x) => (`${x}`)}
                                                    />

                                                </VictoryChart>
                                            </View>
                                            <Text style={styles.textCardEssence}>Receitas por custo/ml</Text>
                                        </View>
                                    </>
                                    : false
                                }


                            </ScrollView>
                            <View style={{ height: RFValue(80) }}></View>
                        </>
                }


            </View >
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
        textAlign: 'center',
        marginTop: RFValue(10)
    },
    textCardRecipeBottom: {
        color: estilo.colors.azul,
        backgroundColor: estilo.colors.cinza,
        fontSize: RFValue(15),
        fontFamily: estilo.fonts.padrao
    },
    button: {
        backgroundColor: estilo.colors.laranja,
        width: '100%',
        height: Dimensions.get('window').height / 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: RFValue(25),
        borderRadius: RFValue(5),
        alignSelf: 'center',


    },
})