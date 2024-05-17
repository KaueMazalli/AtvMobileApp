import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
 
export default function Listagem({ data, deleteItem, editItem }) {
 
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Nome: {data.nome}</Text>
            <Text style={styles.text}>Email: {data.email}</Text>
            <Text style={styles.text}>CPF: {data.cpf}</Text>
            <Text style={styles.text}>Idade: {data.idade}</Text>
 
            <View style={styles.item}>
                <TouchableOpacity onPress={() => deleteItem(data.key)}>
                    <Icon name="trash" color="#8C1717" size={20}>Excluir</Icon>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => editItem(data)}>
                    <Icon name="create" color="#4D4DFF" size={20}>Editar</Icon>
                </TouchableOpacity>
            </View>
        </View>
    )
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginBottom: 5,
        padding: 10,
        backgroundColor: '#B1E1FF',
    },
    text: {
        color: 'black',
        fontSize: 17
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});