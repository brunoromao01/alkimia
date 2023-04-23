import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback, Modal, Dimensions, TouchableOpacity, FlatList, Alert, Switch } from 'react-native'
import { TextInput } from 'react-native-paper'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { getRealm } from '../services/realm'
import { v4 as uuid } from 'uuid'
import estilo from '../estilo'
import Header from '../components/Header'
import { RFValue } from "react-native-responsive-fontsize"
import CardEssence from '../components/CardEssence'
import SeparatorFlatlist from '../components/SeparatorFlatlist'

export default props => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalBrand, setModalBrand] = useState(false);
    const [modalSuplier, setModalSuplier] = useState(false);
    const [search, setSearch] = useState("")
    const [isEssence, setIsEssence] = useState(true)
   

    //marca e fornecedor são os label dos input
    const [marca, setMarca] = useState("Marca")
    const [fornecedor, setFornecedor] = useState("Fornecedor")

    //brands, essences e supliers recebem os dados do banco
    const [brands, setBrands] = useState([])
    const [essences, setEssences] = useState([])
    const [supliers, setSupliers] = useState([])

    const [newBrand, setNewBrand] = useState('') //onchangetext
    const [newBrandFull, setNewBrandFull] = useState({}) //recebe objeto marca para salvar na essencia (banco)
    const [newSuplier, setNewSuplier] = useState('') //onchangetext
    const [newSuplierFull, setNewSuplierFull] = useState({}) //recebe objeto fornecedor para salvar na essencia (banco)
    const [idUpdated, setIdUpdated] = useState(0) //usado para saber se executa update ou save
    const [newName, setNewName] = useState('')
    const [newQuantity, setNewQuantity] = useState('')
    const [newPrice, setNewPrice] = useState('')
    const [newTaste, setNewTaste] = useState('')



    //sobe os dados para os usestates ao carregar a pagina
    useEffect(() => {
        try {
            async function loadSchema() {
                const realm = await getRealm()
                const e = realm.objects('Essence')
                const b = realm.objects('Brand')
                const s = realm.objects('Suplier')
                // realm.write(() => {
                //     realm.deleteAll()
                // })

                setEssences(e)
                setBrands(b)
                setSupliers(s)
                e.addListener((values) => {
                    setEssences([...values])
                })
                b.addListener((values) => {
                    setBrands([...values])
                })
                s.addListener((values) => {
                    setSupliers([...values])
                })

                return () => {
                    e.removeAllListeners()
                    b.removeAllListeners()
                    s.removeAllListeners()
                }
            }
            loadSchema()
        } catch (error) {
            console.log(error)
        }

    }, [])

    function confirmDeletion(item) {
        Alert.alert(
            'Confirmação de exclusão:',
            'Deseja realmente excluir essa essência ?',
            [{
                text: 'Excluir',
                onPress: () => deleteEssence(item),
            },
            {
                text: 'Cancelar',
                onPress: () => { },
                style: 'cancel',
            },
            ],
            {
                cancelable: true,
                onDismiss: () => { }
            },
        );
    }

    // deleta marca
    async function deleteBrand(item) {
        try {
            const realm = await getRealm()
            const essencias = realm.objects('Essence')
            // console.log(essencias)
            const marcalocalizada = essencias.filtered(`brand._id == "${item._id}"`).length
            if (marcalocalizada > 0) {
                Alert.alert('Não é possível a exclusão', 'Marca vinculada a alguma essência')
                return
            } else {
                realm.write(() => {
                    realm.delete(item)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    // deleta essencia
    async function deleteEssence(item) {
        try {
            const realm = await getRealm()
            const receitas = realm.objects('Recipe')
            // console.log(essencias)
            const essencialocalizada = receitas.filtered(`essences._id == "${item._id}"`).length
            if (essencialocalizada > 0) {
                Alert.alert('Não é possível a exclusão', 'Essência vinculada a alguma receita')
                return
            } else {
                realm.write(() => {
                    realm.delete(item)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    // deleta fornecedor
    async function deleteSuplier(item) {
        try {
            const realm = await getRealm()
            const essencias = realm.objects('Essence')
            // console.log(essencias)
            const marcalocalizada = essencias.filtered(`suplier._id == "${item._id}"`).length
            if (marcalocalizada > 0) {
                Alert.alert('Não é possível a exclusão', 'Fornecedor vinculada a alguma essência')
                return
            } else {
                realm.write(() => {
                    realm.delete(item)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Salvando marca no banco
    async function saveNewBrand() {
        const realm = await getRealm()
        try {
            realm.write(() => {
                realm.create("Brand", {
                    _id: `${uuid()}`,
                    name: newBrand
                })
                setNewBrand('')

            })
        } catch (err) {
            console.log('ERRO: ' + err)
        }
    }


    // Salvando fornecedor no banco
    async function saveNewSuplier() {
        const realm = await getRealm()
        try {
            realm.write(() => {
                realm.create("Suplier", {
                    _id: `${uuid()}`,
                    name: newSuplier
                })
                setNewSuplier('')
            })
        } catch (err) {
            console.log('ERRO: ' + err)
        }
    }

    // selecionando marca no select (modal marca)
    const selectedBrand = (item) => {
        setMarca(item.name)
        setNewBrandFull(item)
        console.log(item)
        setModalBrand(!modalBrand)
    }

    // selecionando forneceodr no select (modal fornecedor)
    const selectedSuplier = (item) => {
        setFornecedor(item.name)
        setNewSuplierFull(item)
        setModalSuplier(!modalSuplier)
    }



    // salvando essência no banco
    async function saveNewEssence() {
        const parsePrice = Number(newPrice) / Number(newQuantity)
        const parseQuantity = Number(newQuantity)
        const realm = await getRealm()
        var status = idUpdated == 0 ? 'never' : 'modified'
        var id = idUpdated == 0 ? `${uuid()}` : idUpdated
        console.log(isEssence)
        try {
            realm.write(() => {
                realm.create("Essence", {
                    _id: id,
                    name: newName,
                    brand: newBrandFull,
                    taste: newTaste,
                    quantity: parseQuantity,
                    price: parsePrice,
                    suplier: newSuplierFull,
                    isEssence: isEssence
                }, status)
            })
            setMarca('Marca')
            setFornecedor('Fornecedor')
            setModalVisible(false)
            console.log('')
        } catch (err) {
            console.log('ERRO: ' + err)
        }
    }


    //Ao clicar no trigger Editar (manda o item do card = a essencia a ser editada)
    function updateEssence(data) {
        setIdUpdated(data._id)
        setNewName(data.name)
        setNewQuantity(data.quantity)
        setNewPrice(data.price)
        setNewTaste(data.taste)
        setFornecedor(data.suplier.name)
        setNewSuplierFull(data.suplier)
        setNewBrandFull(data.brand)
        setMarca(data.brand.name)
        setModalVisible(true)
        setIsEssence(data.isEssence)
    }

    // const showEssences = async () => {
    //     const realm = await getRealm()
    //     const essencias = realm.objects('Essence')
    //     console.log(essencias[0].brand.name)

    // }

    // const showBrands = async () => {
    //     const realm = await getRealm()
    //     const marcas = realm.objects('Brand')
    //     console.log(marcas)

    // }



    return (
        <>

            <Header />
            <View style={styles.container} >
                <View style={{ paddingHorizontal: RFValue(20), marginTop: RFValue(10), marginBottom: RFValue(30) }}>
                    {/* <Button title='todas essencias' onPress={() => showEssences()} />
                    <Button title='todas marcas' onPress={() => showBrands()} /> */}

                    <TextInput
                        style={styles.input}
                        mode='outlined'
                        keyboardType='default'
                        label="Pesquise a essência"
                        placeholder='Ex: Strawberry Ripe'
                        placeholderTextColor={'#999'}
                        outlineColor={estilo.colors.azul}
                        activeOutlineColor={estilo.colors.laranja}
                        selectionColor='#ccc'
                        value={search}
                        onChangeText={search => setSearch(search)}

                    />
                </View>

                <View style={styles.viewButtonNew}>
                    <TouchableOpacity onPress={() => {
                        setMarca('Marca')
                        setFornecedor('Fornecedor')
                        setNewName('')
                        setNewQuantity('')
                        setNewPrice('')
                        setNewTaste('')
                        setIdUpdated(0)
                        setModalVisible(true)

                    }}>
                        <View style={{ justifyContent: 'space-around', flexDirection: 'row', paddingVertical: RFValue(7), backgroundColor: 'transparent', paddingHorizontal: RFValue(10), borderWidth: RFValue(2), borderColor: estilo.colors.laranja, borderRadius: RFValue(10), alignItems: 'center' }}>
                            <FontAwesome name='plus' size={RFValue(14)} color={estilo.colors.laranja} />
                            <Text style={{ marginLeft: RFValue(7), color: estilo.colors.laranja }}>Cadastrar Essência</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* cabeçalho das colunas (nome, marca, quantidade) */}
                {
                    essences ?
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <View style={{ width: '45%' }}><Text style={{ marginLeft: RFValue(10) }}>Essência</Text></View>
                            <View style={{ width: '40%', alignItems: 'center' }}><Text>Marca</Text></View>
                            <View style={{ width: '15%' }}><Text>Qtde</Text></View>
                        </View>
                        : false
                }
                <FlatList
                    data={essences}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) =>  <CardEssence updateEssence={updateEssence} confirmDeletion={confirmDeletion} item={item} />}
                    ItemSeparatorComponent={<SeparatorFlatlist />}
                />




                <Modal visible={modalVisible} onDismiss={() => setModalVisible(!modalVisible)} onRequestClose={() => setModalVisible(!modalVisible)} animationType="fade"
                    transparent={true} >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} />
                    </TouchableWithoutFeedback>


                    {/* Bloco central do modal */}
                    <View flexDirection='row' >

                        {/* parte lateral do modal cadastro de essencia */}
                        <View style={{ width: '3%', backgroundColor: 'rgba(0,0,0,0.6)' }} />

                        {/*Modal cadastro de essencia */}
                        <View style={{ width: '94%', paddingTop: RFValue(20), height: '100%', borderWidth: 1, borderColor: estilo.colors.laranja, alignSelf: 'center', backgroundColor: 'white' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginLeft: RFValue(10) }}>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#FAB709' }}
                                    thumbColor={isEssence ? estilo.colors.laranja : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => setIsEssence(!isEssence)}
                                    value={isEssence}
                                />
                                <Text style={styles.buttonText}>É essência ?</Text>
                            </View>

                            <TextInput
                                style={styles.inputModal}
                                mode='outlined'
                                keyboardType='default'
                                label="Nome"
                                placeholder='Ex: Strawberry Ripe'
                                placeholderTextColor={'#999'}
                                outlineColor={estilo.colors.azul}
                                activeOutlineColor={estilo.colors.laranja}
                                selectionColor='#ccc'
                                value={newName}
                                onChangeText={name => setNewName(name)}
                            />

                            <TouchableWithoutFeedback onPress={() => setModalBrand(true)}>
                                <View style={{ width: '90%', borderWidth: 1, alignSelf: 'center', height: RFValue(50), backgroundColor: 'white', marginTop: RFValue(5), borderRadius: RFValue(3), flexDirection: 'row', alignItems: 'center' }}>
                                    {/* <Fontisto name='brand' size={RFValue(14)} color={estilo.colors.laranja} /> */}
                                    <Text style={{ color: estilo.colors.azul, marginLeft: RFValue(12), fontSize: RFValue(15) }}>{marca}</Text>
                                </View>
                            </TouchableWithoutFeedback>


                            {/* Modal cadastro de marca */}
                            <Modal visible={modalBrand} onDismiss={() => setModalVisible(!modalBrand)} onRequestClose={() => setModalBrand(!modalBrand)} animationType="fade"
                                transparent={true} >
                                <View style={{ flex: 3, backgroundColor: 'rgba(0,0,0,0.6)' }}></View>
                                <View style={{ flex: 6, backgroundColor: 'white', paddingVertical: RFValue(15) }}>
                                    <View style={{ flex: 4, borderWidth: 1, borderRadius: RFValue(5), borderColor: estilo.colors.azul, paddingHorizontal: RFValue(10), marginHorizontal: RFValue(10) }}>
                                        <FlatList
                                            data={brands}
                                            scrollEnabled
                                            keyExtractor={item => item._id}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    onLongPress={() => {
                                                        deleteBrand(item)
                                                    }}
                                                    onPress={() => selectedBrand(item)}>
                                                    <View style={{ height: RFValue(50), borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ color: estilo.colors.azul, fontSize: RFValue(15) }}>{item.name}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                    <View style={{ paddingHorizontal: RFValue(20), flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput
                                            style={[styles.inputModal, { height: RFValue(50) }]}
                                            mode='outlined'
                                            keyboardType='default'
                                            label="Nova marca"
                                            placeholder='Cadastre uma nova marca'
                                            placeholderTextColor={'#999'}
                                            outlineColor={estilo.colors.azul}
                                            activeOutlineColor={estilo.colors.laranja}
                                            selectionColor='#ccc'
                                            value={newBrand}
                                            onChangeText={text => setNewBrand(text)}
                                        />

                                        <TouchableOpacity
                                            onPress={() => {
                                                if (newBrand !== '') {
                                                    saveNewBrand()
                                                } else {
                                                    return
                                                }
                                            }}
                                        >
                                            <View style={{ borderRadius: RFValue(5), alignItems: 'center', justifyContent: 'center', height: RFValue(35), width: RFValue(35), backgroundColor: estilo.colors.laranja, marginLeft: RFValue(5), marginTop: RFValue(10) }}>
                                                <FontAwesome name='plus' size={30} color='white' />
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flex: 4, backgroundColor: 'rgba(0,0,0,0.6)' }}></View>
                            </Modal>

                            <TextInput
                                style={styles.inputModal}
                                label="Quantidade (ml)"
                                mode='outlined'
                                keyboardType='number-pad'
                                placeholder='Ex: 15'
                                placeholderTextColor={'#999'}
                                outlineColor={estilo.colors.azul}
                                activeOutlineColor={estilo.colors.laranja}
                                selectionColor='#ccc'
                                value={`${newQuantity}`}
                                onChangeText={quantity => setNewQuantity(quantity)}
                            />

                            <TextInput
                                style={styles.inputModal}
                                label="Preço da quantidade informada ($)"
                                mode='outlined'
                                placeholder='Ex: 25,00'
                                placeholderTextColor={'#999'}
                                keyboardType='number-pad'
                                outlineColor={estilo.colors.azul}
                                activeOutlineColor={estilo.colors.laranja}
                                selectionColor='#ccc'
                                value={`${newPrice}`}
                                onChangeText={price => setNewPrice(price)}
                            />


                            <TextInput
                                style={styles.inputModal}
                                mode='outlined'
                                keyboardType='default'
                                label="Sabor"
                                placeholder='Ex: Suco de morango'
                                placeholderTextColor={'#999'}
                                outlineColor={estilo.colors.azul}
                                activeOutlineColor={estilo.colors.laranja}
                                selectionColor='#ccc'
                                value={newTaste}
                                onChangeText={taste => setNewTaste(taste)}
                            />

                            {/* input fornecedor que abre modal */}
                            <TouchableWithoutFeedback onPress={() => setModalSuplier(true)}>
                                <View style={{ width: '90%', borderWidth: 1, alignSelf: 'center', height: RFValue(50), backgroundColor: 'white', marginTop: RFValue(5), borderRadius: RFValue(3), flexDirection: 'row', alignItems: 'center' }}>
                                    {/* <Fontisto name='brand' size={RFValue(14)} color={estilo.colors.laranja} /> */}
                                    <Text style={{ color: estilo.colors.azul, marginLeft: RFValue(12), fontSize: RFValue(15) }}>{fornecedor}</Text>
                                </View>
                            </TouchableWithoutFeedback>

                            {/* Modal cadastro de fornecedor */}
                            <Modal visible={modalSuplier} onDismiss={() => setModalSuplier(!modalSuplier)} onRequestClose={() => setModalSuplier(!modalSuplier)} animationType="fade"
                                transparent={true} >
                                <View style={{ flex: 3, backgroundColor: 'rgba(0,0,0,0.6)' }}></View>
                                <View style={{ flex: 6, backgroundColor: 'white', paddingVertical: RFValue(15) }}>
                                    <View style={{ flex: 4, borderWidth: 1, borderRadius: RFValue(5), borderColor: estilo.colors.azul, paddingHorizontal: RFValue(10), marginHorizontal: RFValue(10) }}>
                                        <FlatList
                                            data={supliers}
                                            scrollEnabled
                                            keyExtractor={item => item._id}
                                            renderItem={({ item }) => (

                                                <TouchableWithoutFeedback onLongPress={() => deleteSuplier(item)} onPress={() => selectedSuplier(item)}>
                                                    <View style={{ height: RFValue(50), borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ color: estilo.colors.azul, fontSize: RFValue(15) }}>{item.name}</Text>
                                                    </View>
                                                </TouchableWithoutFeedback>

                                            )}
                                        />
                                    </View>
                                    <View style={{ paddingHorizontal: RFValue(20), flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput
                                            style={[styles.inputModal, { height: RFValue(50) }]}
                                            mode='outlined'
                                            keyboardType='default'
                                            label="Novo fornecedor"
                                            placeholder='Cadastre um novo fornecedor'
                                            placeholderTextColor={'#999'}
                                            outlineColor={estilo.colors.azul}
                                            activeOutlineColor={estilo.colors.laranja}
                                            selectionColor='#ccc'
                                            value={newSuplier}
                                            onChangeText={text => setNewSuplier(text)}
                                        />

                                        <TouchableOpacity
                                            onPress={() => {
                                                if (newSuplier !== '') {
                                                    saveNewSuplier()
                                                } else {
                                                    return
                                                }
                                            }}
                                        >
                                            <View style={{ borderRadius: RFValue(5), alignItems: 'center', justifyContent: 'center', height: RFValue(35), width: RFValue(35), backgroundColor: estilo.colors.laranja, marginLeft: RFValue(5), marginTop: RFValue(10) }}>
                                                <FontAwesome name='plus' size={RFValue(30)} color='white' />
                                            </View>

                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ flex: 4, backgroundColor: 'rgba(0,0,0,0.6)' }}></View>
                            </Modal>

                            <TouchableOpacity
                                onPress={() => saveNewEssence()}
                            >
                                <View style={styles.button}>
                                    <Text style={styles.buttonText}>Salvar essência</Text>
                                </View>

                            </TouchableOpacity>





                        </View>
                        <View style={{ width: '3%', backgroundColor: 'rgba(0,0,0,0.6)' }} />
                    </View>
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={{ flex: 1, backgroundColor: 'transparent', backgroundColor: 'rgba(0,0,0,0.6)' }} />
                    </TouchableWithoutFeedback>
                </Modal>


                <View style={{ height: RFValue(70) }}></View>
            </View >
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {},
    slide1: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: RFValue(5)
    },
    inputModal: {
        width: '90%',
        alignSelf: 'center',
        borderRadius: RFValue(10),
        height: RFValue(50),
        fontSize: RFValue(15),
        backgroundColor: 'white',
        color: estilo.colors.azul
    },
    container: {
        flex: 1,

        backgroundColor: 'white',

    },
    body: {
        borderRadius: RFValue(10),
        height: '85%',
        width: '100%',
        paddingVertical: RFValue(20),
        paddingHorizontal: RFValue(20),
        alignSelf: 'center',
        backgroundColor: 'white'

    },
    viewButtonNew: {
        alignSelf: 'flex-end',
        marginRight: RFValue(10),
        marginVertical: RFValue(10),
        justifyContent: 'flex-start',
    },
    inputSearch: {
        marginBottom: RFValue(5),
        backgroundColor: 'white',
        fontSize: RFValue(15),
        // height: RFValue(50),
        borderRadius: RFValue(5),
    },

    input: {
        marginBottom: RFValue(5),
        backgroundColor: 'white',
        fontSize: RFValue(15),
        height: RFValue(50),
        borderRadius: RFValue(5)
    },
    modalView: {
        justifyContent: 'center',
        backgroundColor: estilo.colors.azul,
        borderRadius: RFValue(20),
        paddingVertical: RFValue(40),
        paddingHorizontal: RFValue(15),
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
    button: {
        backgroundColor: estilo.colors.laranja,
        width: '90%',
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
    wrapper: {
        justifyContent: 'center'

    },
    card: {
        width: '90%',
        height: RFValue(70),
        backgroundColor: estilo.colors.cinza
    },
    textCard: {
        color: estilo.colors.azul,
        fontSize: RFValue(20)
    },
    cardEssence: {
        width: '100%',
        backgroundColor: estilo.colors.cinza,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        flexDirection: 'row',
        padding: RFValue(10),
        elevation: 1,
        borderRadius: RFValue(5)
    },
    textCardEssence: {
        color: estilo.colors.azul,
        backgroundColor: estilo.colors.cinza,
        fontSize: RFValue(15),
        fontFamily: estilo.fonts.padrao
    },

})