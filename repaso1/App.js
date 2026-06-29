//npx create-expo-app@latest repaso1 --template blank 
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Platform, 
        Alert, StyleSheet, Keyboard, Switch, ScrollView } from 'react-native';

export default function App() {

  const [nombre, setNombre] = useState('');
  const [carrera, setCarrera] = useState('');
  const [semestre, setSemestre] = useState('');

  const [asistiraTaller, setAsistiraTaller] = useState(false);
  const [requiereConstancia, setRequiereConstancia] = useState(false);
  const [participaraDeportes, setParticiparaDeportes] = useState(false);

  const procesarRegistro = () => {
    if (Platform.OS !== 'web') Keyboard.dismiss();

    if (!nombre.trim() || !carrera.trim() || !semestre.trim()) {
      alertasManager("Campos incompletos", "Debes llenar todos los campos.");
      return;
    }

    const textoTaller = asistiraTaller ? 'Sí' : 'No';
    const textoConstancia = requiereConstancia ? 'Sí' : 'No';
    const textoDeportes = participaraDeportes ? 'Sí' : 'No';

    const reporte = `Nombre: ${nombre}\nCarrera: ${carrera}\nSemestre: ${semestre}\n\nTaller: ${textoTaller}\nConstancia: ${textoConstancia}\nDeportes: ${textoDeportes}`;
    
    alertasManager("Registro hecho", reporte);
  };

  const alertasManager = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
      alert(`${titulo}\n\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje, [{ text: "Aceptar" }]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Registro de Evento Universitario</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Nombre Completo" 
          value={nombre} 
          onChangeText={setNombre} 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Carrera" 
          value={carrera} 
          onChangeText={setCarrera}
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Semestre" 
          value={semestre} 
          onChangeText={setSemestre} 
          keyboardType="numeric" 
          maxLength={2} 
        />

        <Text style={styles.sectionTitle}>Opciones</Text>
        
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>¿Asistirá al taller?</Text>
          <Switch 
            value={asistiraTaller} 
            onValueChange={setAsistiraTaller}
            trackColor={{ false: "#767577", true: "#00a8ff" }}
            thumbColor={asistiraTaller ? "#fff" : "#f4f3f4"}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>¿Requiere constancia?</Text>
          <Switch 
            value={requiereConstancia} 
            onValueChange={setRequiereConstancia}
            trackColor={{ false: "#767577", true: "#00a8ff" }}
            thumbColor={requiereConstancia ? "#fff" : "#f4f3f4"}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>¿Participará en deportes?</Text>
          <Switch 
            value={participaraDeportes} 
            onValueChange={setParticiparaDeportes}
            trackColor={{ false: "#767577", true: "#00a8ff" }}
            thumbColor={participaraDeportes ? "#fff" : "#f4f3f4"}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Enviar Registro" onPress={procesarRegistro} color="#007bff" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  mainTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#000', textAlign: 'left' },
  input: { borderWidth: 1, borderColor: '#e1e1e1', padding: 14, borderRadius: 8, marginBottom: 16, backgroundColor: '#fff', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 16, marginBottom: 16, color: '#000' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  switchLabel: { fontSize: 16, color: '#333' },
  buttonContainer: { marginTop: 16, borderRadius: 8, overflow: 'hidden' }
});