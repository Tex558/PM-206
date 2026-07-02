import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Butto, TextInput, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Button } from 'react-native';
import React, {Activity, useState} from 'react';

export default function ActIndicatorScreen() {

  const [nombre, setNombre] = useState('');
  const [carrera, setCarrera] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGuardar = () => {
    if(nombre.trim() === '' || carrera.trim() === ''){
      alert('Por favor llena todos los campos.');
      return;
    }
      setIsLoading(true);
  setTimeout(() => {
    setIsLoading(false);
    alert('Perfil guardado con exito');

    setNombre('');
    setCarrera('');
    }, 3000);
  };

  return (

      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior = {Platform.OS === 'ios' ? 'padding' : 'height' }
          style = {StyleSheet.formContainer}
        >
          <View>
            <View>
              <Text style = {styles.titulo}> Agregar Perfil </Text>
              <TextInput
                style = {styles.input}
                placeholder='Nombre completo'
                value = {nombre}
                onChangeText={setNombre}
              />
              <TextInput
                style = {styles.input}
                placeholder='Carrera'
                value = {carrera}
                onChangeText={setCarrera}
              />
            </View>
            <View syle = {styles.actionArea}>
              {isLoading ? (
                <ActivityIndicator/>
              ) : (
                <Button title = "Guardar perfil" onPress={handleGuardar} color = "#4D96FF"/>
              )}
            </View>
          </View>

        </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  formContainer: {
    flex: 1, 
  },
  formContainerInner: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between', 
  },
  formBody: {
    flex: 1, 
    justifyContent: 'center', 
  },
  actionArea: {
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50, 
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  loader: {
    marginVertical: 10,
  }
});