import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Card, Text, TextInput } from "react-native-paper";
import React, { useState } from "react";
import firebase from "../services/connectionFirebase";
 
export default function Login({ changeStatus }) {
  const [type, setType] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  function handleLogin() {
    // Verificar se o email contém '@'
    if (!email.includes('@')) {
      alert('Por favor, insira um endereço de email válido.');
      return;
    }
 
    // Verificar se a senha tem pelo menos 8 caracteres
    if (password.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
 
    // Verificar se a senha contém pelo menos uma letra maiúscula
    if (!/[A-Z]/.test(password)) {
      alert('A senha deve conter pelo menos uma letra maiúscula.');
      return;
    }
 
    // Verificar se a senha contém pelo menos um número
    if (!/\d/.test(password)) {
      alert('A senha deve conter pelo menos um número.');
      return;
    }
 
    // Verificar se a senha contém pelo menos um caractere especial
    if (!/[^a-zA-Z0-9]/.test(password)) {
      alert('A senha deve conter pelo menos um caractere especial.');
      return;
    }
 
    if (type === 'login') {
      // Fazer o login
      const user = firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          changeStatus(user.user.uid)
        })
        .catch((err) => {
          console.log(err);
          alert('Email ou senha não cadastrados!');
        });
    } else {
      // Cadastrar usuário
      const user = firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          changeStatus(user.user.uid)
        })
        .catch((err) => {
          console.log(err);
          alert('Erro ao Cadastrar!');
        });
    }
  }
 
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Card>
        <Card.Title title="" subtitle="" />
        <Card.Content>
          <Text variant="bodyMedium"></Text>
          <TextInput
            style={styles.label}
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.label}
            mode="outlined"
            label="Senha"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </Card.Content>
      </Card>
      <TouchableOpacity
        style={[
          styles.handleLogin,
          { backgroundColor: type === "login" ? "#4682B4" : "#265AAB" },
        ]}
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>
          {type === "login" ? "Logar" : "Cadastrar"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
  style={[
    styles.toggleButton,
    { backgroundColor: type === "login" ? "#4682B4" : "#265AAB" },
  ]}
  onPress={() => setType(type === "login" ? "cadastrar" : "login")}
>
  <Text style={styles.toggleButtonText}>
    {type === "login" ? "Criar uma conta" : "Já possuo uma conta"}
  </Text>
</TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E7EB",
    textAlign: "center",
  },
  logo: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 100,
  },
  label: {
    marginBottom: 10,
    color: "red",
  },
  loginText: {
    color: "#FFF",
    fontSize: 24,
  },
  handleLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginTop: 30,
  },
  toggleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginTop: 10,
    borderRadius: 5,
  },
  toggleButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  }
});