import React, { useState } from 'react';
import { View, SafeAreaView, Text, TextInput, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ActualizarUsuarioScreen() {
  const params = useLocalSearchParams();
  const [nombre, setNombre] = useState(params.nombre || '');
  const [edad, setEdad] = useState(params.edad ? params.edad.toString() : '');
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  const API_URL = 'http://localhost:5000';

  const mostrarMensaje = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n ${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const actualizarUsuario = async () => {
    if (nombre.trim() === '' || edad.trim() === '') {
      mostrarMensaje('Campos vacíos', 'Completa todos los campos.');
      return;
    }

    try {
      setCargando(true);
      const respuesta = await fetch(`${API_URL}/v1/usuarios/${params.id}`, {
        method: 'PUT',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Basic YWRtaW46MTIzNA=="
        },
        body: JSON.stringify({ nombre: nombre, edad: Number(edad) })
      });
      const datos = await respuesta.json();
      console.log("Respuesta API", datos);
      
      mostrarMensaje("Éxito","Usuario actualizado correctamente");
      router.back();

    } catch (error) {
      console.log("Error API", error);
      mostrarMensaje("Error", "No fue posible actualizar")
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>
          Actualizar Usuario
        </Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del usuario"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          placeholder="Edad del usuario"
          keyboardType="numeric"
          value={edad}
          onChangeText={setEdad}
        />

        <Pressable style={styles.boton} onPress={actualizarUsuario} disabled={cargando}>
          <Text style={styles.textoBoton}>
            {cargando ? "Guardando..." : "Guardar cambios"} 
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 40,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 15,
    elevation: 5, 
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#1F2937',
  },
  label: { fontSize: 14, color: '#6B7280', marginBottom: 5, fontWeight: 'bold' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 18,
    backgroundColor: '#F9FAFB',
    fontSize: 16,
  },
  boton: {
    backgroundColor: '#FBBF24',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBoton: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
