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
    ImageBackground, // Importe o ImageBackground do React Native
} from "react-native";
import { TextInput } from "react-native-paper";
import firebase from "../services/connectionFirebase";
import Listagem from "../components/clienteslist";
 
const Separator = () => {
    return <View style={styles.separator} />;
};
 
export default function ClientesManager() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [idade, setIdade] = useState("");
    const [clientes, setClientes] = useState([]);
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
            await firebase.database().ref('clientes').on('value', (snapshot) => {
                const clientesData = [];
                snapshot.forEach((childItem) => {
                    let data = {
                        key: childItem.key,
                        nome: childItem.val().nome,
                        email: childItem.val().email,
                        cpf: childItem.val().cpf,
                        idade: childItem.val().idade,
                    };
                    clientesData.push(data);
                });
                setClientes(clientesData.reverse());
                setLoading(false);
            });
        }
        search();
    }, []);
 
    async function insertUpdate() {
        if (nome === '' || email === '' || cpf === '' || idade === '') {
            setEmptyFieldModalVisible(true);
            return;
        }
 
        if (key !== '') {
            setModalAction('edit');
            setModalVisible(true);
            return;
        }
 
        try {
            let prods = await firebase.database().ref('clientes');
            let keyprod = prods.push().key;
 
            await prods.child(keyprod).set({
                nome: nome, email: email, cpf: cpf, idade: idade
            });
 
            // Atualizar o estado clientes com o novo cliente
            setClientes([...clientes, { key: keyprod, nome, email, cpf, idade }]);
            // Exibir o modal de inserção concluída
            setInsertModalVisible(true);
            // Limpar os campos após a inserção ser concluída
            clearData();
        } catch (error) {
            console.error("Error inserting client: ", error);
        }
    }
 
    function clearData() {
        setNome('');
        setEmail('');
        setCpf('');
        setIdade('');
    }
 
    function handleDelete(key) {
        setKey(key);
        setModalAction('delete');
        setModalVisible(true);
    }
 
    function handleEdit(data) {
        setKey(data.key);
        setNome(data.nome);
        setEmail(data.email);
        setCpf(data.cpf);
        setIdade(data.idade);
    }
 
    function confirmAction() {
        if (modalAction === 'delete') {
            firebase.database().ref('clientes').child(key).remove()
                .then(() => {
                    const findClientes = clientes.filter(item => item.key !== key);
                    setClientes(findClientes);
                    setModalVisible(false); // Fechar o modal após a exclusão
                });
        } else if (modalAction === 'edit') {
            firebase.database().ref('clientes').child(key).update({
                nome: nome, email: email, cpf: cpf, idade: idade
            }).then(() => {
                setUpdateModalVisible(true);
                setModalVisible(false); // Fechar o modal de edição após a confirmação
                clearData(); // Limpar os campos após a edição ser confirmada
            }).catch((error) => {
                console.error("Error updating client: ", error);
            });
        }
    }
 
    return (
        <ImageBackground
            // Caminho da imagem de fundo
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <TextInput
                    placeholder="Nome"
                    left={<TextInput.Icon icon="wrench" />}
                    maxLength={40}
                    style={styles.input}
                    onChangeText={(texto) => setNome(texto)}
                    value={nome}
                    ref={inputRef}
                />
                <Separator />
                <TextInput
                    placeholder="Email"
                    left={<TextInput.Icon icon="lock" />}
                    style={styles.input}
                    onChangeText={(texto) => setEmail(texto)}
                    value={email}
                    ref={inputRef}
                />
                <Separator />
                <TextInput
                    placeholder="CPF"
                    left={<TextInput.Icon icon="lock" />}
                    style={styles.input}
                    onChangeText={(texto) => setCpf(texto)}
                    value={cpf}
                    ref={inputRef}
                />
                <Separator />
                <TextInput
                    placeholder="Idade"
                    left={<TextInput.Icon icon="glasses" />}
                    style={styles.input}
                    onChangeText={(texto) => setIdade(texto)}
                    value={idade}
                    ref={inputRef}
                />
                <Separator />
                <TouchableOpacity onPress={insertUpdate} style={styles.button} activeOpacity={0.5}>
                    <Text style={styles.buttonTextStyle}>Salvar</Text>
                </TouchableOpacity>
 
                <View>
                    <Text style={styles.listar}>Listagem de Clientes</Text>
                </View>
 
                {loading ? (
                    <ActivityIndicator color="#121212" size={45} />
                ) : (
                    <FlatList
                        keyExtractor={item => item.key}
                        data={clientes}
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
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.buttonTextStyle}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.modalButton]}
                                    onPress={confirmAction}
                                >
                                    <Text style={styles.buttonTextStyle}>Confirmar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
 
                {/* Modal de Inserção */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={insertModalVisible}
                    onRequestClose={() => setInsertModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Cliente Inserido!</Text>
                            <TouchableOpacity
                                style={[styles.button, styles.modalButton]}
                                onPress={() => setInsertModalVisible(false)}
                            >
                                <Text style={styles.buttonTextStyle}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
 
                {/* Modal de Atualização */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={updateModalVisible}
                    onRequestClose={() => setUpdateModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Cliente Alterado!</Text>
                            <TouchableOpacity
                                style={[styles.button, styles.modalButton]}
                                onPress={() => setUpdateModalVisible(false)}
                            >
                                <Text style={styles.buttonTextStyle}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
 
                {/* Modal de Aviso de Campo Vazio */}
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
        backgroundColor: "transparent", // Defina o plano de fundo como transparente
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover", // Cobertura da imagem
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