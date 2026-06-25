import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, TextInput, View, Platform, Alert, Keyboard, Button } from 'react-native';

export default function TextInputScreen() {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [edad, setEdad] = useState('');
  const [correo, setCorreo] = useState('');

  const procesarRegistro = () => {

    if(Platform.OS !== 'web') Keyboard.dismiss();
    if(!nombre || !password || !edad || !correo){

      alertasManager("Validacion", "Todos los campos son obligatorios");
      return;

    }

    alertasManager("Exito", 'Registro procesado para: ${nombre} ');
  };

  const alertasManager = (titulo, mensaje) =>{
    if (Platform.OS === 'web'){
      alert('${titulo}: ${mensaje}');

    } else{ 

      Alert.alert(titulo,mensaje); 
    }
  };

  return(
    <View style={styles.container}>

    {}
    <TextInput style={style.imput} placeholder="Nombre completo" 
    value = {nombre} on onChangeText={setNombre}/>

    {}
    <TextInput style={style.imput} placeholder="Contraseña" 
    value = {password} on onChangeText={setPassword} secureTextEntry={true}/>

    {}
    <TextInput style={style.imput} placeholder="Edad" 
    value = {edad} on onChangeText={setEdad} keyboardType="numeric" maxLength={5}/>

    {}
    <TextInput style={style.imput} placeholder="Correo" 
    value = {correo} on onChangeText={setCorreo} keyboardType="email-address" 
    autoCapitalize="none" autoCorrect={false}/>

    {}
    <Button
      title="registrar usuario"
      onPress={procesarRegistro}
    />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, justifyContent:
    'center', padding: 20, 
    backgroundColor: '#f5f6fa' },
  input: { 
    borderWidth: 1, 
    borderColor: '#dcdde1',
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 12, 
    backgroundColor: '#fff' }
});