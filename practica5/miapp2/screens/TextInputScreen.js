import React, { useState } from 'react';
import { View, TextInput, Button, Platform, Alert, StyleSheet, Keyboard } from 'react-native';

export default function TextInputScreen() {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [edad, setEdad] = useState('');
  const [correo, setCorreo] = useState('');

  const procesarRegistro = () => {
    if (Platform.OS !== 'web') Keyboard.dismiss();

    if (!nombre || !password || !edad || !correo) {
      alertasManager("Validación", "Todos los campos son obligatorios.");
      return;
    }

    alertasManager("Éxito", `Registro procesado para: ${nombre}`);
  };

  const alertasManager = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
      alert(`${titulo}: ${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Nombre Completo" 
      value={nombre} onChangeText={setNombre} />
      
      <TextInput style={styles.input} placeholder="Contraseña" 
      value={password} onChangeText={setPassword} secureTextEntry={true} />
      
      <TextInput style={styles.input} placeholder="Edad" value={edad} 
      onChangeText={setEdad} keyboardType="numeric" maxLength={3} />
      
      <TextInput style={styles.input} placeholder="Correo Electrónico" 
      value={correo} onChangeText={setCorreo} keyboardType="email-address" 
      autoCapitalize="none" autoCorrect={false} />

      <Button title="Registrar Usuario" onPress={procesarRegistro} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f6fa' },
  input: { borderWidth: 1, borderColor: '#dcdde1', padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' }
});