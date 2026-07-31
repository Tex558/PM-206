import React, { useState, useCallback } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

export default function ConsultarUsuariosScreen() {
  const API_URL = 'http://localhost:5000';

  const [usuarios, setUsuarios] = useState([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchUsuarios = async () => {
        try {
          const respuesta = await fetch(`${API_URL}/v1/usuarios/`);
          const datos = await respuesta.json();
          console.log("Respuesta API:", datos);
          setUsuarios(datos.usuarios);
        } catch (error) {
          console.error('Error API:', error);
        }
      };

      fetchUsuarios();
    }, [])
  );

  const renderTarjeta = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>{item.nombre}</Text>

      <View style={styles.linea}></View>

      <Text style={styles.info}>
        Edad: {item.edad} años
      </Text>

      <TouchableOpacity 
        style={styles.detailsLink} 
        onPress={() => router.push({ pathname: '/detalle', params: { id: item.id, nombre: item.nombre, edad: item.edad } })}
      >
        <Text style={styles.detailsLinkText}>Ver detalles -{'>'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>
        Lista de Usuarios
      </Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={renderTarjeta}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  linea: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },
  info: {
    fontSize: 16,
    color: '#4B5563',
  },
  detailsLink: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  detailsLinkText: {
    color: '#3B82F6',
    fontWeight: 'bold',
    fontSize: 14,
  }
});