//zona1: importaciones
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native'; // Cambiado Button por Pressable para poder darle estilo personalizado

import React,{useState} from 'react';
import TarjetasScreen from './TarjetasScreen';
import SafeAreaScreen from './SafeAreaScreen';
import PressScreen from './PressScreen';
import TextInputScreen from './TextInputScreen';
import FlatListScreen from './FlatListScreen';
import ImgBackgroundScreen from './ImgBackgroundScreen';
import ActIndicatorScreen from './ActIndicatorScreen';
import ModalScreen from './ModalScreen';

//Zona2: main - hogar de la aplicación, donde se renderizan los componentes y se define la estructura visual de la app
export default function MenuScreen() {
  const [screen,setScreen]= useState('menu');

  switch(screen){
    case 'tarjetas':
      return <TarjetasScreen />
    case 'safeArea':
      return <SafeAreaScreen />
    case 'Press':
      return <PressScreen />
    case 'textInput':
      return <TextInputScreen />
    case 'flatList':
      return <FlatListScreen />
    case 'imgBackground':
      return <ImgBackgroundScreen />
    case 'actIndicator':
      return <ActIndicatorScreen />
    case 'modal':
      return <ModalScreen />
    case 'menu':
      default:
        return (
      <View style={styles.container}>

          <Text style={styles.title}>Menú de Prácticas</Text>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={()=>setScreen('tarjetas')}>
              <Text style={styles.buttonText}>Tarjetas</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={()=>setScreen('safeArea')}>
              <Text style={styles.buttonText}>safeArea</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={()=>setScreen('Press')}>
              <Text style={styles.buttonText}>Press</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={()=>setScreen('textInput')}>
              <Text style={styles.buttonText}>TextInput</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={()=>setScreen('flatList')}>
              <Text style={styles.buttonText}>FlatList</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={()=>setScreen('imgBackground')}>
              <Text style={styles.buttonText}>ImgBackground</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={()=>setScreen('actIndicator')}>
              <Text style={styles.buttonText}>ActIndicator</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={()=>setScreen('modal')}>
              <Text style={styles.buttonText}>Modal</Text>
            </Pressable>
          </View>

      <StatusBar style="dark" />
    </View>
  );
  }
}

//Zona3: estilos - define los estilos para los componentes de la aplicación, en este caso, el contenedor principal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '300',
    color: '#333333',
    marginBottom: 30,
    letterSpacing: 1,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonText: {
    color: '#555555',
    fontSize: 15,
    fontWeight: '500',
  },
});