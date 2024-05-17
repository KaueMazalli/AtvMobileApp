import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Alert } from 'react-native';

export default function App() {
  const handleButtonPress = () => {
    Alert.alert('Botão pressionado');
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require(`./../assets/logo.png`)}
      />
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Aperte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#778899',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 330,
    height: 300,
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#4287f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
