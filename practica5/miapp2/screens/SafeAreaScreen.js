import React, { useState } from 'react';
import {SafeAreaView, ScrollView, View, Text, StyleSheet, Switch,} from 'react-native';


export default function SafeAreaScreen() {

  const [activo, setActivo] = useState(true);

  const Contenedor = activo ? SafeAreaView : View;

  return (
    <Contenedor style={styles.fondo}>

      <Text style={styles.titulo}>SafeAreaView y ScrollView</Text>

      <Text style={styles.descripcion}>
        SafeAreaView evita que el contenido se tape con el notch del celular.
        Apaga el switch para ver la diferencia.
      </Text>

      <View style={styles.fila}>
        <Text style={styles.etiqueta}> Activar SafeAreaView </Text>
        
        <Switch
          value={activo}
          onValueChange={(valor) => setActivo(valor)}
        />
      </View>

      <Text style={styles.descripcion}>
        ScrollView permite hacer scroll cuando hay mucho contenido.
      </Text>

      <ScrollView style={styles.lista}>
        <View style={[styles.tarjeta, { backgroundColor: '#e74c3c' }]}>
          <Text style={styles.textoTarjeta}>Elemento 1</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#3498db' }]}>
          <Text style={styles.textoTarjeta}>Elemento 2</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#2ecc71' }]}>
          <Text style={styles.textoTarjeta}>Elemento 3</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#f39c12' }]}>
          <Text style={styles.textoTarjeta}>Elemento 4</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#9b59b6' }]}>
          <Text style={styles.textoTarjeta}>Elemento 5</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#1abc9c' }]}>
          <Text style={styles.textoTarjeta}>Elemento 6</Text>
        </View>
        <View style={[styles.tarjeta, { backgroundColor: '#727272' }]}>
          <Text style={styles.textoTarjeta}>Elemento 7</Text>
        </View>
      </ScrollView>

    </Contenedor>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 13,
    color: '#aaaaaa',
    textAlign: 'center',
    marginBottom: 12,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  etiqueta: {
    color: '#ffffff',
    fontSize: 14,
  },
  lista: {
    flex: 1,
  },
  tarjeta: {
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  textoTarjeta: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});