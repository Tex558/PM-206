import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DetalleUsuarioScreen() {
  const { id, nombre, edad } = useLocalSearchParams();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  
  const API_URL = 'http://localhost:5000';

  const confirmarEliminacion = async () => {
    try {
      const response = await fetch(`${API_URL}/v1/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": "Basic YWRtaW46MTIzNA=="
        }
      });
      if (response.ok) {
        setModalVisible(false);
        router.back(); 
      } else {
        Alert.alert('Error', 'No se pudo eliminar el usuario');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Ocurrió un error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Detalles del Usuario</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>{nombre}</Text>
        
        <View style={styles.linea}></View>

        <Text style={styles.label}>Edad</Text>
        <Text style={styles.value}>{edad} años</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.btnActualizar]}
          onPress={() => {
            router.push({
              pathname: '/actualizar',
              params: { id, nombre, edad }
            });
          }}
        >
          <Text style={styles.btnTextActualizar}>Actualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.btnEliminar]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.btnTextEliminar}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Confirmar eliminación</Text>
            <Text style={styles.modalText}>
              ¿Estás seguro de que deseas eliminar al usuario {nombre}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnConfirm]}
                onPress={confirmarEliminacion}
              >
                <Text style={styles.modalBtnTextConfirm}>Sí, eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#1F2937' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: { width: 0, height: 2 } },
  label: { fontSize: 14, color: '#6B7280', marginBottom: 5 },
  value: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 10 },
  linea: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 15 },
  buttonContainer: { marginTop: 30, alignItems: 'center' },
  button: { width: '50%', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  btnActualizar: { backgroundColor: '#FBBF24' },
  btnEliminar: { backgroundColor: '#EF4444' },
  btnTextActualizar: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  btnTextEliminar: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 25, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#EF4444', marginBottom: 15 },
  modalText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  modalBtnCancel: { backgroundColor: '#F3F4F6' },
  modalBtnConfirm: { backgroundColor: '#EF4444' },
  modalBtnTextCancel: { color: '#374151', fontWeight: 'bold' },
  modalBtnTextConfirm: { color: 'white', fontWeight: 'bold' }
});
