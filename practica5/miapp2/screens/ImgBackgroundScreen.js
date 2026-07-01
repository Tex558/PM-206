import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator
} from 'react-native';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {
  /* Manejar errores silenciosos */
});

export default function FondoPantalla() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function prepararAplicacion() {
      try {
        
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      } finally {
        
        setLoading(false);
      }
    }

    prepararAplicacion();
  }, []);

  
  useEffect(() => {
    if (!loading) {
      
      SplashScreen.hideAsync();
    }
  }, [loading]);

  
  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#0000ff" style={{ marginBottom: 20 }} />
        <Text style={styles.splashText}>Cargando aplicación...</Text>
      </View>
    );
  }

  
  return (
    <ImageBackground
      source={{ uri: 'https://picsum.photos/500/900' }}
      style={styles.background}
      resizeMode="cover"
    >
      {/* El overlay ayuda a que los textos blancos contrasten y sean legibles */}
      <View style={styles.overlay}>
        <Text style={styles.titulo}>Bienvenido a React Native</Text>
        <Text style={styles.subtitulo}>
          Ejemplo de ImageBackground y SplashScreen
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  splashText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  background: {
    flex: 1, 
    width: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    color: '#e0e0e0',
    textAlign: 'center',
  },
});