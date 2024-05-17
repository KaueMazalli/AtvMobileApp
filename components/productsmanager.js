import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    FlatList,
    ActivityIndicator,
    Modal,
    ImageBackground,
} from "react-native";
import { TextInput } from "react-native-paper";
import firebase from "../services/connectionFirebase";
import Listagem from "../components/productslist";

const Separator = () => {
    return <View style={styles.separator} />;
};

export default function ClientesManager() {
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [type, setType] = useState("");
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [key, setKey] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [insertModalVisible, setInsertModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [emptyFieldModalVisible, setEmptyFieldModalVisible] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        async function search() {
            await firebase.database().ref('products').on('value', (snapshot) => {
                const produtosData = [];
                snapshot.forEach((childItem) => {
                    let data = {
                        key: childItem.key,
                        name: childItem.val().name,
                        brand: childItem.val().brand,
                        price: childItem.val().price,
                        type: childItem.val().type,
                    };
                    produtosData.push(data);
                });
                setProdutos(produtosData.reverse());
                setLoading(false);
            });
        }
        search();
    }, []);

    async function insertUpdate() {
        if (name === '' || brand === '' || price === '' || type === '') {
            setEmptyFieldModalVisible(true);
            return;
        }

        if (key !== '') {
            setModalAction('edit');
            setModalVisible(true);
            return;
        }

        try {
            let prods = await firebase.database().ref('products');
            let keyprod = prods.push().key;

            await prods.child(keyprod).set({
                name: name, brand: brand, price: price, type: type
            });

            setProdutos([...produtos, { key: keyprod, name, brand, price, type }]);
            setInsertModalVisible(true);
            clearData();
        } catch (error) {
            console.error("Error inserting product: ", error);
        }
    }

    function clearData() {
        setName('');
        setBrand('');
        setPrice('');
        setType('');
    }

    function handleDelete(key) {
        setKey(key);
        setModalAction('delete');
        setModalVisible(true);
    }

    function handleEdit(data) {
        setKey(data.key);
        setName(data.name);
        setBrand(data.brand);
        setPrice(data.price);
        setType(data.type);
    }

    function confirmAction() {
        if (modalAction === 'delete') {
            firebase.database().ref('products').child(key).remove()
                .then(() => {
                    const findProdutos = produtos.filter(item => item.key !== key);
                    setProdutos(findProdutos);
                    setModalVisible(false);
                });
        } else if (modalAction === 'edit') {
            firebase.database().ref('products').child(key).update({
                name: name, brand: brand, price: price, type: type
            }).then(() => {
                setUpdateModalVisible(true);
                setModalVisible(false);
                clearData();
            }).catch((error) => {
                console.error("Error updating product: ", error);
            });
        }
    }

    return (
        <ImageBackground
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <TextInput
                    placeholder="Nome"
                    left={<TextInput.Icon icon="wrench" />}
                    maxLength={40}
                    style={styles.input}
                    onChangeText={(texto) => setName(texto)}
                    value={name}
                    ref={inputRef}
                />
                <Separator />
                <TextInput
                    placeholder="Marca"
                    left={<TextInput.Icon icon="lock" />}
                    style={styles.input}
                    onChangeText={(texto) => setBrand(texto)}
                    value={brand}
                    ref={inputRef}
                />
                <Separator />
                <TextInput
                    placeholder="Preço"
                    left={<TextInput.Icon icon="lock" />}
                    style={styles.input}
                    onChangeText={(texto) => setPrice(texto)}
                    value={price}
                    ref={inputRef}
                />
                <Separator />
                <TextInput
                    placeholder="Tipo"
                    left={<TextInput.Icon icon="glasses" />}
                    style={styles.input}
                    onChangeText={(texto) => setType(texto)}
                    value={type}
                    ref={inputRef}
                />
                <Separator />
                <TouchableOpacity onPress={insertUpdate} style={styles.button} activeOpacity={0.5}>
                    <Text style={styles.buttonTextStyle}>Salvar</Text>
                </TouchableOpacity>

                <View>
                    <Text style={styles.listar}>Listagem de Produtos</Text>
                </View>

                {loading ? (
                    <ActivityIndicator color="#121212" size={45} />
                ) : (
                    <FlatList
                        keyExtractor={item => item.key}
                        data={produtos}
                        renderItem={({ item }) => (
                            <Listagem data={item} deleteItem={handleDelete} editItem={handleEdit} />
                        )}
                    />
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Confirmar ação?</Text>
                            <View style={styles.modalButtons}>
                            <TouchableOpacity
                                    style={[styles.button, styles.modalButton]}
                                    onPress={confirmAction}
                                >
                                    <Text style={styles.buttonTextStyle}>Confirmar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.modalButton]}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonTextStyle}>Cancelar</Text>
                                </TouchableOpacity>
                                
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={insertModalVisible}
                    onRequestClose={() => setInsertModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Produto Inserido!</Text>
                            <TouchableOpacity
                                style={[styles.button, styles.modalButton]}
                                onPress={() => setInsertModalVisible(false)}
                            >
                                <Text style={styles.buttonTextStyle}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={updateModalVisible}
                    onRequestClose={() => setUpdateModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Produto Alterado!</Text>
                            <TouchableOpacity
                                style={[styles.button, styles.modalButton]}
                                onPress={() => setUpdateModalVisible(false)}
                            >
                                <Text style={styles.buttonTextStyle}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={emptyFieldModalVisible}
                    onRequestClose={() => setEmptyFieldModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Você não preencheu um campo!</Text>
                            <TouchableOpacity
                                style={[styles.button, styles.modalButton]}
                                onPress={() => setEmptyFieldModalVisible(false)}
                            >
                                <Text style={styles.buttonTextStyle}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        backgroundColor: "transparent",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        height: 40,
        fontSize: 16,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "#CECDFC",
    },
    separator: {
        marginVertical: 5,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#05038B',
        padding: 14,
        borderRadius: 8,
        marginVertical: 10,
    },
    buttonTextStyle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    listar: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#000000",
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        color: "#333",
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalButton: {
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 8,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
