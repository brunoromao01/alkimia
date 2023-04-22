import React, { useCallback, useState } from 'react'
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Alert, TouchableWithoutFeedback, Modal, FlatList, Button } from 'react-native'
import AwesomeAlert from 'react-native-awesome-alerts';
import { TextInput } from 'react-native-paper'
import SelectDropdown from 'react-native-select-dropdown'
import Header from '../components/Header'
import estilo from '../estilo'
import Slider from '@react-native-community/slider'
import CardRecipe from '../components/CardRecipe'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useFocusEffect } from '@react-navigation/native'
import { getRealm } from '../services/realm'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import { v4 as uuid } from 'uuid'
import InputRecipe from '../components/InputRecipe'
import SeparatorFlatlist from '../components/SeparatorFlatlist'
import { useRef } from 'react'

const height = Dimensions.get('window').height

export default props => {
    const [range, setRange] = useState(70) //slide vg pg
    const [essenceSelected, setEssenceSelected] = useState({})
    const [essences, setEssences] = useState({})
    const [vgpg, setVgpg] = useState({})
    const [modalVisible, setModalVisible] = useState(false);
    const [changeViewForInsert, setChangeViewForInsert] = useState(true);
    const [showModalProduce, setShowModalProduce] = useState(false);
    const [quantidade, setQuantidade] = useState();
    const [showButtonSaveRecipe, setShowButtonSaveRecipe] = useState(true);
    const [quantityPercentEmpty, setQuantityPercent] = useState(false);
    const [essenceEmpty, setEssenceEmpty] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [nameRecipe, setNameRecipe] = useState('');
    const [idRecipe, setIdRecipe] = useState(0);
    const [quantityRecipe, setQuantityRecipe] = useState(0);
    const [breath, setBreath] = useState(0);
    const [months, setMonths] = useState(0);
    const [newQuantityRecipe, setNewQuantityrecipe] = useState(0);
    const [recipeWillProduced, setRecipeWillProduced] = useState();
    const [vgSelected, setVgSelected] = useState();
    const [pgSelected, setPgSelected] = useState();
    const refNameRecipe = useRef()
    const refQuantityRecipe = useRef()



    const [recipes, setRecipes] = useState([]);
    const [essencesWithPercent, setEssencesWithPercent] = useState([]); //usado apenas para juntar essencias e percentuais para o inputrecipe
    const [essencesList, setEssencesList] = useState([]);
    const [percents, setPercents] = useState([]);


    useFocusEffect(useCallback(() => {
        async function getEssences() {
            const realm = await getRealm()
            const ess = realm.objects('Essence')
            const e = ess.filtered('isEssence == true')
            setEssences(e)
            const v = ess.filtered('isEssence == false')
            setVgpg(e)
            const r = realm.objects('Recipe')
            setRecipes(r)

            e.addListener((values) => {
                setEssences([...values])
            })
            r.addListener((values) => {
                setRecipes([...values])
            })
            v.addListener((values) => {
                setVgpg([...values])
            })

            return () => {
                e.removeAllListeners()
                r.removeAllListeners
                v.removeAllListeners
            }

        }
        getEssences()
    }, []))

    //adicionando esencia e percentual na listagem
    const insertEssence = async () => {
        var essenciaRepetida = false
        if (quantidade == undefined || quantidade == '') {
            setQuantityPercent(true)
        }
        if (!essenceSelected._id) {
            setEssenceEmpty(true)
        }
        if (quantidade > 0 && essenceSelected._id) {
            console.log(essencesWithPercent)
            for (let index = 0; index < essencesWithPercent.length; index++) {
                if (essencesWithPercent[index].essencia == essenceSelected) {
                    console.log('já cadastrado')
                    Alert.alert('Não é possível prosseguir', 'Produto já informado na receita')
                    essenciaRepetida = true
                } else {
                    essenciaRepetida = false
                }
            }
            if (!essenciaRepetida) {
                setEssencesWithPercent(old => [...old, { essencia: essenceSelected, percent: Number(quantidade) }])
                setPercents(old => [...old, Number(quantidade)])
                setEssencesList(old => [...old, essenceSelected])
                setModalVisible(false)
                setEssenceSelected({})
                setQuantidade('')
                setShowButtonSaveRecipe(false)
            }
        }
    }

    //deletando essencia da listagem da receita
    const deletingItem = async (data, index) => {
        console.log(idRecipe)
        if (idRecipe != 0) {
            var essenceListFiltered2 = []
            var essencePercentFiltered2 = []
            for (let ind = 0; ind < essencesList.length; ind++) {
                if (ind != index) {
                    essenceListFiltered2.push(essencesList[ind])
                    essencePercentFiltered2.push(percents[ind])
                }
            }
            const realm = await getRealm()
            realm.write(() => {
                const r = realm.objectForPrimaryKey('Recipe', idRecipe)
                const modificado = realm.create('Recipe', {
                    _id: idRecipe,
                    name: r.name,
                    vg: r.vg,
                    pg: r.pg,
                    createdAt: r.createdAt,
                    essences: essenceListFiltered2,
                    percents: essencePercentFiltered2.splice(index, 1),
                    essencePg: pgSelected,
                    essenceVg: vgSelected
                }, 'modified')
            })
        }
        console.log('aqui1')
        const essenceListFiltered = [...essencesList]
        const essencePercentFiltered = [...percents]

        const essencesFiltered = essencesWithPercent.filter(essence => essence != data)
        console.log('aqui2')
        essenceListFiltered.splice(index, 1)
        essencePercentFiltered.splice(index, 1)
        console.log('aqui3')
        setEssencesList(essenceListFiltered)
        setPercents(essencePercentFiltered)
        setEssencesWithPercent(essencesFiltered)
        if (essencesFiltered.length == 0) setShowButtonSaveRecipe(true)
    }

    const editingRecipe = ({ name, essences, percents, vg, _id, essenceVg, essencePg }) => {
        setEssencesWithPercent([])
        essences.map((essence, ind) => {
            setEssencesWithPercent(old => [...old, { essencia: essence, percent: percents[ind] }])
        })
        setPgSelected(essencePg)
        setVgSelected(essenceVg)
        setNameRecipe(name)
        setRange(vg)
        setEssencesList(essences)
        setPercents(percents)
        setShowButtonSaveRecipe(false)
        setChangeViewForInsert(true)
        setIdRecipe(_id)
    }

    const cloningRecipe = ({ name, essences, percents, vg, essenceVg, essencePg }) => {
        setEssencesWithPercent([])
        essences.map((essence, ind) => {
            setEssencesWithPercent(old => [...old, { essencia: essence, percent: percents[ind] }])
        })
        setPgSelected(essencePg)
        setVgSelected(essenceVg)
        setNameRecipe(name)
        setRange(vg)
        setEssencesList(essences)
        setPercents(percents)
        setShowButtonSaveRecipe(false)
        setChangeViewForInsert(true)
        setIdRecipe(0)
    }

    const deletingRecipe = async data => {
        try {
            const realm = await getRealm()
            const recipeProduced = realm.objects('RecipeProduced')
            const recipe = realm.objectForPrimaryKey('Recipe', data._id)
            const receitalocalizada = recipeProduced.filtered(`recipe._id == "${data._id}"`).length
            if (receitalocalizada > 0) {
                Alert.alert('Não é possível a exclusão', 'Receita já produzida. Não será possível a exclusão')
                return
            } else {
                realm.write(() => {
                    realm.delete(recipe)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const producingRecipe = async data => {
        setShowModalProduce(true)
        setRecipeWillProduced(data)
    }

    //compara quantidade usada na receita com quantidade disponivel
    //caso quantidade disponivel seja menor, é recomendado a maior quantidade
    const productionAnalysis = async () => {
        const arrQuantidadeEstoque = []
        const arrQuantidadeUsada = []
        const arrDivergencia = []
        var cont = 0
        //arrQuantidadeUsada = convertendo a porcentagem das essencias da receita em valor, baseado na quantidade da receita
        recipeWillProduced.percents.map(percent => arrQuantidadeUsada.push((percent * quantityRecipe) / 100))
        //arrQuantidadeEstoque = quantidade no estoque de cada essência
        recipeWillProduced.essences.map(essencia => arrQuantidadeEstoque.push(essencia.quantity))

        for (let index = 0; index < arrQuantidadeEstoque.length; index++) {
            if (arrQuantidadeUsada[index] <= arrQuantidadeEstoque[index]) {
                cont++ //contador para saber se todas as essencias estao com estoque ok
            } else {
                // array grava a quantidade maxima que poderia ser feito de cada essencia que ficou com falta
                arrDivergencia.push(arrQuantidadeEstoque[index] / (recipeWillProduced.percents[index] / 100))
            }
        }

        if (cont < arrQuantidadeEstoque.length) {
            //minValue é o menor valor do arrDivergencia. Quantidade que será recomendada como maximo possivel para produção
            const minValue = arrDivergencia.reduce(function (prev, current) {
                return prev < current ? prev : current;
            });
            console.log('salvar receita com quantidade recomendada')
            setNewQuantityrecipe(minValue)
            setShowAlert(true)
        } else {
            console.log('salvar receita com quantidade informada')
            saveRecipeProduced(quantityRecipe)
        }

    }

    async function saveRecipeProduced(quantity) {
        const realm = await getRealm()
        try {
            realm.write(() => {
                const recipeProduced = realm.create('RecipeProduced', {
                    _id: `${uuid()}`,
                    recipe: recipeWillProduced,
                    createdAt: new Date(),
                    months: Number(months),
                    breath: Number(breath),
                    rating: Number(0),
                    quantity: Number(quantity)
                })
                console.log(recipeProduced)
            })
            setQuantityRecipe('')
            setBreath('')
            setMonths('')
            setRecipeWillProduced('')
            setShowModalProduce(false)
        } catch (error) {
            console.log('ERRO: ' + error)
        }
    }


    async function saveNewRecipe() {
        console.log(idRecipe)
        const vg = Number(range)
        const pg = 100 - Number(range)
        const realm = await getRealm()
        var status = idRecipe == 0 ? 'never' : 'modified'
        var id = idRecipe == 0 ? `${uuid()}` : idRecipe
        try {
            console.log('aqui')
            realm.write(() => {
                realm.create('Recipe', {
                    _id: id,
                    name: nameRecipe,
                    vg: vg,
                    pg: pg,
                    createdAt: new Date(),
                    essences: essencesList,
                    percents: percents,
                    essencePg: pgSelected,
                    essenceVg: vgSelected
                }, status)
                setEssencesWithPercent([])
                setPercents([])
                setEssencesList([])
                setNameRecipe('')
                setShowButtonSaveRecipe(true)
                setVgSelected('')
                setPgSelected('')
            })
        } catch (error) {
            console.log('ERRO: ' + error)
        }
    }

    return (
        <>
            <View style={styles.container}>
                <Header />

                <View style={styles.body}>
                    <View style={{ flexDirection: 'row', width: '100%', marginBottom: RFValue(30), paddingHorizontal: RFValue(20) }}>

                        <TouchableWithoutFeedback onPress={() => setChangeViewForInsert(true)}>
                            <View style={{ width: '50%', alignItems: 'center', borderBottomWidth: changeViewForInsert ? 3 : 1, borderColor: changeViewForInsert ? estilo.colors.azul : '#666' }}>
                                <Text style={[styles.buttonText, { fontFamily: estilo.fonts.padrao, color: changeViewForInsert ? estilo.colors.azul : '#666' }]}>
                                    Nova Receita
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => setChangeViewForInsert(false)}>
                            <View style={{ width: '50%', alignItems: 'center', borderBottomWidth: changeViewForInsert ? 1 : 3, borderColor: changeViewForInsert ? '#666' : estilo.colors.azul }}>
                                <Text style={[styles.buttonText, { fontFamily: estilo.fonts.padrao, color: changeViewForInsert ? '#666' : estilo.colors.azul }]}>
                                    Receitas cadastradas
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>

                    {/* modal de produção de receita */}
                    <Modal visible={showModalProduce} onDismiss={() => setShowModalProduce(!showModalProduce)} onRequestClose={() => setShowModalProduce(!showModalProduce)} animationType="fade"
                        transparent={true} >
                        <TouchableWithoutFeedback onPress={() => setShowModalProduce(false)}>
                            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} />
                        </TouchableWithoutFeedback>


                        {/* Bloco central do modal */}
                        <View flexDirection='row' >

                            {/* parte lateral do modal cadastro de essencia */}
                            <View style={{ width: '3%', backgroundColor: 'rgba(0,0,0,0.6)' }} />

                            {/*Modal cadastro de essencia */}
                            <View style={{ width: '94%', padding: RFValue(20), height: '100%', borderWidth: 1, borderColor: estilo.colors.laranja, alignSelf: 'center', backgroundColor: 'white' }}>
                                <TextInput
                                    ref={refQuantityRecipe}
                                    style={styles.inputModal}
                                    mode='outlined'
                                    keyboardType='decimal-pad'
                                    label="*Quantidade (ml)"
                                    placeholder='Ex: 100'
                                    placeholderTextColor={'#999'}
                                    outlineColor={estilo.colors.azul}
                                    activeOutlineColor={estilo.colors.laranja}
                                    selectionColor='#ccc'
                                    value={quantityRecipe}
                                    onChangeText={q => setQuantityRecipe(q)}
                                />
                                <TextInput
                                    style={styles.inputModal}
                                    mode='outlined'
                                    keyboardType='decimal-pad'
                                    label="Descanso (dias)"
                                    placeholder='Ex: 14'
                                    placeholderTextColor={'#999'}
                                    outlineColor={estilo.colors.azul}
                                    activeOutlineColor={estilo.colors.laranja}
                                    selectionColor='#ccc'
                                    value={breath}
                                    onChangeText={d => setBreath(d)}
                                />
                                <TextInput
                                    style={styles.inputModal}
                                    mode='outlined'
                                    keyboardType='decimal-pad'
                                    label="Vencimento (meses)"
                                    placeholder='Ex: 6'
                                    placeholderTextColor={'#999'}
                                    outlineColor={estilo.colors.azul}
                                    activeOutlineColor={estilo.colors.laranja}
                                    selectionColor='#ccc'
                                    value={months}
                                    onChangeText={m => setMonths(m)}
                                />

                                <TouchableOpacity
                                    onPress={() => {
                                        if (quantityRecipe == undefined || quantityRecipe == '' || quantityRecipe == 0) {
                                            console.log(quantityRecipe)
                                            refQuantityRecipe.current.focus();
                                        } else {
                                            console.log('productionAnalysis')
                                            productionAnalysis()
                                        }
                                    }}
                                >
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>Produzir Receita</Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                            {/* parte lateral do modal*/}
                            <View style={{ width: '3%', backgroundColor: 'rgba(0,0,0,0.6)' }} />
                        </View>
                        {/* Bloco abaixo do modal */}
                        <TouchableWithoutFeedback onPress={() => setShowModalProduce(false)}>
                            <View style={{ flex: 1, backgroundColor: 'transparent', backgroundColor: 'rgba(0,0,0,0.6)' }} />
                        </TouchableWithoutFeedback>
                    </Modal>

                    {
                        changeViewForInsert ?
                            <View style={{ paddingHorizontal: RFValue(20) }}>
                                <View style={{ alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-between' }}>
                                        <Text style={styles.textSlider}>{range}</Text>
                                        <Text style={styles.textSlider}>{(range - 100) * -1}</Text>
                                    </View>
                                </View>
                                <Slider
                                    minimumValue={0}
                                    maximumValue={100}
                                    step={1}
                                    value={range}
                                    onValueChange={setRange}
                                    minimumTrackTintColor={estilo.colors.laranja}
                                    maximumTrackTintColor={estilo.colors.azul}
                                    thumbTintColor={estilo.colors.laranja}
                                />
                                <View style={{ alignItems: 'center', paddingHorizontal: 5 }}>
                                    <View style={{ flexDirection: 'row', width: '90%', justifyContent: 'space-between', height: RFValue(30) }}>
                                        <Text style={styles.textSlider}>VG</Text>
                                        <Text style={styles.textSlider}>PG</Text>
                                    </View>
                                </View>

                                <TextInput
                                    ref={refNameRecipe}
                                    style={styles.inputModal}
                                    mode='outlined'
                                    keyboardType='default'
                                    label="*Nome da mistura"
                                    placeholder='Ex: Unicorn Milk'
                                    placeholderTextColor={'#999'}
                                    outlineColor={estilo.colors.azul}
                                    activeOutlineColor={estilo.colors.laranja}
                                    selectionColor='#ccc'
                                    value={nameRecipe}
                                    onChangeText={recipe => setNameRecipe(recipe)}
                                />

                                <View style={styles.viewButtonNew}>
                                    <TouchableOpacity onPress={() => {
                                        if (nameRecipe == undefined || nameRecipe == '') {
                                            refNameRecipe.current.focus();
                                        } else {
                                            setModalVisible(!modalVisible)
                                            setEssenceSelected({})
                                        }
                                    }}>
                                        <View style={{ justifyContent: 'space-around', flexDirection: 'row', paddingVertical: RFValue(7), backgroundColor: 'transparent', paddingHorizontal: RFValue(10), borderWidth: 2, borderColor: estilo.colors.laranja, borderRadius: 10, alignItems: 'center' }}>
                                            <FontAwesome name='plus' size={RFValue(14)} color={estilo.colors.laranja} />
                                            <Text style={{ marginLeft: RFValue(7), color: estilo.colors.laranja }}>Inserir Essência</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <Modal visible={modalVisible} onDismiss={() => {
                                    setModalVisible(!modalVisible)
                                    setEssenceSelected({})
                                    setQuantityPercent(false)
                                    setEssenceEmpty(false)
                                }} onRequestClose={() => {
                                    setModalVisible(!modalVisible)
                                    setEssenceSelected({})
                                    setQuantityPercent(false)
                                    setEssenceEmpty(false)
                                }} animationType="fade"
                                    transparent={true} >
                                    {/* Bloco topo do modal */}
                                    <TouchableWithoutFeedback onPress={() => {
                                        setModalVisible(false)
                                        setEssenceSelected({})
                                        setQuantityPercent(false)
                                        setEssenceEmpty(false)
                                    }}>
                                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} />
                                    </TouchableWithoutFeedback>


                                    {/* Bloco central do modal */}
                                    <View flexDirection='row'>

                                        {/* parte lateral do modal*/}
                                        <View style={{ width: '3%', backgroundColor: 'rgba(0,0,0,0.6)' }} />

                                        {/*Modal inserir essencia na listagem da mistura */}
                                        <View style={{ width: '94%', paddingHorizontal: RFValue(10), paddingTop: RFValue(20), height: '100%', borderWidth: 1, borderColor: estilo.colors.laranja, alignSelf: 'center', backgroundColor: 'white' }}>
                                            <SelectDropdown
                                                data={essences}
                                                onSelect={(selectedItem, index) => {
                                                    setEssenceSelected(selectedItem)
                                                    setEssenceEmpty(false)
                                                    setQuantityPercent(false)
                                                    setEssenceEmpty(false)
                                                }}
                                                renderCustomizedButtonChild={(selectedItem, index) => {
                                                    return (
                                                        <View style={styles.viewDropDown}>
                                                            {/* <FontAwesome name="tags" color={estilo.colors.azul} size={RFValue(28)} /> */}
                                                            <Text style={styles.textDropDown}>{selectedItem ? selectedItem.name : '*Essência'}</Text>
                                                            <Text style={styles.textDropDown}>{selectedItem ? '-' : false}</Text>
                                                            <Text style={styles.textDropDown}>{selectedItem ? selectedItem.brand.name : false}</Text>
                                                        </View>
                                                    );
                                                }}
                                                renderCustomizedRowChild={(item, index) => {
                                                    return (
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                            <Text style={styles.textDropDown}>{item.name}</Text>
                                                            <Text style={styles.textDropDown}> - </Text>
                                                            <Text style={styles.textDropDown}>{item.brand.name}</Text>
                                                        </View>
                                                    );
                                                }}
                                                search
                                                // searchInputStyle={styles.dropdown3searchInputStyleStyle}
                                                searchPlaceHolder={'Pesquisa por essência ou marca'}
                                                searchPlaceHolderColor={'#aaa'}
                                                renderSearchInputLeftIcon={() => {
                                                    return <FontAwesome name={'search'} color={'#aaa'} size={18} />;
                                                }}
                                                buttonTextAfterSelection={selectedItem => selectedItem.name}
                                                rowTextForSelection={item => item}
                                                buttonTextStyle={{ color: estilo.colors.azul, textAlign: 'left', fontSize: RFValue(15) }}
                                                buttonStyle={{ borderWidth: 1, borderColor: estilo.colors.azul, width: '100%', backgroundColor: 'white', marginVertical: RFValue(5), borderRadius: RFValue(5), height: RFValue(50) }}
                                                defaultButtonText={'*Essência'}
                                                dropdownStyle={{ backgroundColor: 'white' }}
                                                renderDropdownIcon={() => <Fontisto name='angle-down' size={RFValue(16)} color={estilo.colors.azul} />}
                                                rowTextStyle={{ backgroundColor: 'white', fontSize: RFValue(15) }}
                                                rowStyle={{ backgroundColor: 'white' }}
                                                dropdownIconPosition='right'
                                            />
                                            {essenceEmpty ? <Text style={{ color: '#ccc' }}>*Informe uma essência</Text> : false}
                                            <TextInput
                                                // ref={refQuantidadePorcentagem}
                                                style={styles.inputModal}
                                                mode='outlined'
                                                keyboardType='decimal-pad'
                                                label="*Quantidade (%)"
                                                placeholder='Ex: 5'
                                                placeholderTextColor={'#999'}
                                                outlineColor={estilo.colors.azul}
                                                activeOutlineColor={estilo.colors.laranja}
                                                selectionColor='#ccc'
                                                value={quantidade}
                                                onChangeText={q => setQuantidade(q)}
                                            />
                                            {quantityPercentEmpty && !quantidade ? <Text>*Digite a quantidade</Text> : false}
                                            <TouchableOpacity
                                                onPress={() => insertEssence()}
                                            >
                                                <View style={[styles.button, { marginTop: RFValue(50), marginBottom: RFValue(20) }]}>
                                                    <Text style={styles.buttonText}>Salvar essência</Text>
                                                </View>

                                            </TouchableOpacity>

                                        </View>

                                        {/* parte lateral do modal*/}
                                        <View style={{ width: '3%', backgroundColor: 'rgba(0,0,0,0.6)' }} />
                                    </View>
                                    {/* Bloco abaixo do modal */}
                                    <TouchableWithoutFeedback onPress={() => {
                                        setModalVisible(false)
                                        setEssenceSelected({})
                                        setQuantidade()
                                        setQuantityPercent(false)
                                        setEssenceEmpty(false)
                                    }}>
                                        <View style={{ flex: 1, backgroundColor: 'transparent', backgroundColor: 'rgba(0,0,0,0.6)' }} />
                                    </TouchableWithoutFeedback>
                                </Modal>
                                <View style={{ height: '46%' }}>
                                    <FlatList
                                        data={essencesWithPercent}
                                        keyExtractor={item => item.essencia._id}

                                        ListHeaderComponent={() => {
                                            var percentTotal = 0
                                            percents.map(percent => percentTotal += percent)
                                            var pgTotal = 100 - range - percentTotal

                                            return (
                                                <>
                                                    <View flexDirection='row' style={[styles.cardEssence, { padding: 5 }]}>
                                                        <View style={{ width: '20%', paddingLeft: RFValue(10), justifyContent: 'center' }}>
                                                            <Text style={styles.textCardEssence}>VG</Text>
                                                        </View>
                                                        <View style={{ width: '50%' }}>
                                                            <SelectDropdown
                                                                data={vgpg}
                                                                onSelect={(selectedItem, index) => {
                                                                    setVgSelected(selectedItem)
                                                                }}
                                                                renderCustomizedButtonChild={(selectedItem, index) => {
                                                                    var textVg = ''
                                                                    if (selectedItem) {
                                                                        textVg = selectedItem.brand.name
                                                                    } else if (vgSelected) {
                                                                        textVg = vgSelected.brand.name
                                                                    } else {
                                                                        textVg = '*Selecione o VG'
                                                                    }
                                                                    return (
                                                                        <View style={styles.ingredienteDropdown}>
                                                                            <Text style={styles.textDropDown}>{textVg}</Text>
                                                                        </View>
                                                                    )

                                                                }}

                                                                renderCustomizedRowChild={(item, index) => {
                                                                    return (
                                                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                                            <Text style={styles.textDropDown}>{item.brand.name}</Text>
                                                                        </View>
                                                                    );
                                                                }}
                                                                buttonTextAfterSelection={selectedItem => selectedItem.name}
                                                                rowTextForSelection={item => item}
                                                                buttonTextStyle={{ color: estilo.colors.azul, textAlign: 'left', fontSize: RFValue(12) }}
                                                                buttonStyle={{ alignItems: 'center', borderWidth: 1, borderColor: estilo.colors.azul, width: '100%', backgroundColor: 'white', borderRadius: RFValue(5), height: RFValue(25) }}
                                                                defaultButtonText={'*Essência'}
                                                                dropdownStyle={{ backgroundColor: 'white' }}
                                                                renderDropdownIcon={() => <Fontisto name='angle-down' size={RFValue(12)} color={estilo.colors.azul} />}
                                                                rowTextStyle={{ backgroundColor: 'white', fontSize: RFValue(15) }}
                                                                rowStyle={{ backgroundColor: 'white' }}
                                                                dropdownIconPosition='right'
                                                            />
                                                        </View>
                                                        <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={styles.textCardEssence}>{range}%</Text>
                                                        </View>
                                                        <View style={{ width: '10%', alignItems: 'flex-end' }}>
                                                        </View>
                                                    </View>
                                                    <SeparatorFlatlist />
                                                    <View flexDirection='row' style={[styles.cardEssence, { padding: RFValue(5) }]}>
                                                        <View style={{ width: '20%', paddingLeft: RFValue(10), justifyContent: 'center' }}>
                                                            <Text style={styles.textCardEssence}>PG</Text>
                                                        </View>
                                                        <View style={{ width: '50%' }}>
                                                            <SelectDropdown
                                                                data={vgpg}
                                                                onSelect={(selectedItem, index) => {
                                                                    setPgSelected(selectedItem)
                                                                }}
                                                                renderCustomizedButtonChild={(selectedItem, index) => {
                                                                    var textPg = ''
                                                                    if (selectedItem) {
                                                                        textPg = selectedItem.brand.name
                                                                    } else if (pgSelected) {
                                                                        textPg = pgSelected.brand.name
                                                                    } else {
                                                                        textPg = '*Selecione o PG'
                                                                    }
                                                                    return (
                                                                        <View style={styles.ingredienteDropdown}>
                                                                            <Text style={styles.textDropDown}>{textPg}</Text>
                                                                        </View>
                                                                    )
                                                                }}
                                                                renderCustomizedRowChild={(item, index) => {
                                                                    return (
                                                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                                            <Text style={styles.textDropDown}>{item.brand.name}</Text>
                                                                        </View>
                                                                    );
                                                                }}
                                                                buttonTextAfterSelection={selectedItem => selectedItem.name}
                                                                rowTextForSelection={item => item}
                                                                buttonTextStyle={{ color: estilo.colors.azul, textAlign: 'left', fontSize: RFValue(12) }}
                                                                buttonStyle={{ alignItems: 'center', borderWidth: 1, borderColor: estilo.colors.azul, width: '100%', backgroundColor: 'white', borderRadius: RFValue(5), height: RFValue(25) }}
                                                                defaultButtonText={'*Essência'}
                                                                dropdownStyle={{ backgroundColor: 'white' }}
                                                                renderDropdownIcon={() => <Fontisto name='angle-down' size={RFValue(12)} color={estilo.colors.azul} />}
                                                                rowTextStyle={{ backgroundColor: 'white', fontSize: RFValue(15) }}
                                                                rowStyle={{ backgroundColor: 'white' }}
                                                                dropdownIconPosition='right'
                                                            />
                                                        </View>
                                                        <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={styles.textCardEssence}>{pgTotal}%</Text>
                                                        </View>
                                                        <View style={{ width: '10%', alignItems: 'flex-end' }} />
                                                    </View>
                                                    <SeparatorFlatlist />
                                                </>
                                            )
                                        }}
                                        renderItem={({ item, index }) => <InputRecipe data={item} deletion={deletingItem} index={index} />}
                                        ItemSeparatorComponent={<SeparatorFlatlist />}
                                    >
                                    </FlatList>

                                </View>
                                {
                                    showButtonSaveRecipe ?
                                        false :
                                        <>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    if (vgSelected == undefined || vgSelected == '' || pgSelected == undefined || pgSelected == '') {
                                                        console.log('vg ou pg vazio')
                                                    } else {
                                                        saveNewRecipe()
                                                    }
                                                }}
                                            >
                                                <View style={[styles.button]}>
                                                    <Text style={styles.buttonText}>Salvar receita</Text>
                                                </View>

                                            </TouchableOpacity>
                                            {/* <View style={{height: RFValue(70), backgroundColor: 'blue'}}></View> */}
                                        </>
                                }

                            </View>


                            : <>
                                <AwesomeAlert
                                    show={showAlert}
                                    showProgress={false}
                                    title="Ops, quantidade incompatível"
                                    message={`As essências não tem estoque suficiente. O máximo que pode ser produzido é ${newQuantityRecipe.toFixed(2)}ml. Deseja fazer essa nova quantidade ? `}
                                    closeOnTouchOutside={false}
                                    closeOnHardwareBackPress={false}
                                    showCancelButton={true}
                                    showConfirmButton={true}
                                    cancelText="Cancelar."
                                    confirmText="Sim, eu quero."
                                    confirmButtonColor={estilo.colors.laranja}
                                    onCancelPressed={() => setShowAlert(false)}
                                    onConfirmPressed={() => {
                                        setShowAlert(false)
                                        setShowModalProduce(false)
                                        saveRecipeProduced(newQuantityRecipe)
                                    }}

                                />

                                <FlatList
                                    data={recipes}
                                    keyExtractor={item => item._id}
                                    renderItem={({ item }) => <CardRecipe data={item} deletingRecipe={deletingRecipe} cloningRecipe={cloningRecipe} producingRecipe={producingRecipe} editingRecipe={editingRecipe} />}
                                    ItemSeparatorComponent={<SeparatorFlatlist />}
                                ></FlatList>

                            </>

                    }


                </View >


            </View >
            <View style={{ flex: 1 }} />
        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 9,
    },
    body: {
        borderRadius: RFValue(10),
        height: '100%',
        width: '100%',
        paddingVertical: RFValue(20),
        // paddingHorizontal: RFValue(20),
        alignSelf: 'center',

        backgroundColor: 'white',
    },
    textSlider: {
        fontSize: RFValue(15),
        color: estilo.colors.azul,
        textAlign: 'center',
        fontFamily: estilo.fonts.padrao
    },
    input: {
        marginBottom: RFValue(5),
        backgroundColor: 'white',
        fontSize: RFValue(18),
        height: RFValue(50),
        borderRadius: RFValue(5)

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
    buttonText: {
        color: estilo.colors.azul,
        fontSize: RFValue(16),
        fontFamily: estilo.fonts.negrito,

    },
    fields: {
        width: '100%',
        backgroundColor: estilo.colors.cinza,
        padding: RFValue(10),
        marginTop: RFValue(15)
    },
    tableTitle: {
        fontFamily: estilo.fonts.negrito,
        fontSize: RFValue(20),
        color: estilo.colors.cinza
    },
    textIng: {
        fontFamily: estilo.fonts.padrao,
        fontSize: RFValue(15),
        color: estilo.colors.cinza,
    },
    viewRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: estilo.colors.cinza,
        marginBottom: RFValue(5)
    },
    viewCellSmaller: {
        width: '14%',
        alignItems: 'center'
    },
    viewCellBigger: {
        width: '45%',
        alignItems: 'flex-start'
    },
    viewDropDown: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    textDropDown: {
        marginLeft: RFValue(10),
        color: estilo.colors.azul,
        fontSize: RFValue(15)
    },
    viewButtonNew: {
        alignSelf: 'flex-end',
        // marginRight: RFValue(10),
        marginBottom: RFValue(5),
        justifyContent: 'flex-start',
        marginTop: RFValue(20),
    },
    inputModal: {
        width: '100%',
        alignSelf: 'center',
        borderRadius: RFValue(10),
        height: RFValue(50),
        fontSize: RFValue(15),
        backgroundColor: 'white',
        color: estilo.colors.azul
    },
    dropdown3searchInputStyleStyle: {
        backgroundColor: 'slategray',
        borderBottomWidth: 1,
        borderBottomColor: '#FFF',
    },
    textCardEssence: {
        color: estilo.colors.azul,
        fontFamily: estilo.fonts.padrao
    },
    cardEssence: {
        width: '100%',
        backgroundColor: estilo.colors.cinza,

        padding: RFValue(10),
        elevation: 1,
    },
    ingredienteDropdown: {

    }
})