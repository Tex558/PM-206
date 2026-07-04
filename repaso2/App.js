import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [genero, setGenero] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [libros, setLibros] = useState([
    { id: '1', titulo: 'El principito', autor: 'Antoine de Saint', genero: 'Infantil' }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const agregarLibro = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }

    if (!titulo.trim() || !autor.trim() || !genero.trim()) {
      if (Platform.OS === 'web') {
        alert("Campos Incompletos: Por favor, completa el título, el autor y el género.");
      } else {
        Alert.alert("Campos Incompletos", "Todos los campos son obligatorios.");
      }
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const nuevoLibro = {
        id: Date.now().toString(),
        titulo: titulo.trim(),
        autor: autor.trim(),
        genero: genero.trim(),
      };

      setLibros((librosPrev) => [nuevoLibro, ...librosPrev]);
      setTitulo('');
      setAutor('');
      setGenero('');
      setIsSaving(false);

      if (Platform.OS === 'web') {
        alert("Libro agregado con éxito.");
      } else {
        Alert.alert("El libro fue agregado con éxito.");
      }
    }, 4000);
  };

  const eliminarLibro = (id, tituloLibro) => {
    if (Platform.OS === 'web') {
      if (confirm(`¿Deseas eliminar "${tituloLibro}"?`)) {
        setLibros((librosPrev) => librosPrev.filter(l => l.id !== id));
      }
    } else {
      Alert.alert(
        "Eliminar libro",
        `¿Deseas eliminar "${tituloLibro}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: () => setLibros((librosPrev) => librosPrev.filter(l => l.id !== id))
          }
        ]
      );
    }
  };

  const renderLibro = ({ item }) => (
    <View style={styles.libroCard}>
      <View style={styles.libroHeader}>
        <View style={styles.libroDetalle}>
          <Text style={styles.libroTitulo}>{item.titulo}</Text>
          <Text style={styles.libroAutor}>Autor: {item.autor} - Género: {item.genero}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.botonEliminar,
            pressed && styles.botonEliminarPresionado
          ]}
          onPress={() => eliminarLibro(item.id, item.titulo)}
        >
          <Text style={styles.botonEliminarTexto}>X</Text>
        </Pressable>
      </View>
    </View>
  );

  if (showSplash) {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <StatusBar style="dark" />
        <View style={styles.splashContent}>
          <Text style={styles.splashTitle}>Mis lecturas</Text>
          <Text style={styles.splashSubtitle}>Organiza tus libros favoritos</Text>
          <ActivityIndicator size="small" color="#000" style={{ marginTop: 20 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1000' }}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Registro de Libros</Text>
              <Text style={styles.headerSubtitle}>Guarda y gestiona tus obras preferidas</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Agregar Nueva Lectura</Text>

              <Text style={styles.label}>Título del Libro</Text>
              <TextInput
                style={styles.input}
                placeholder="Cien Años de Soledad"
                placeholderTextColor="#7f8c8d"
                value={titulo}
                onChangeText={setTitulo}
                editable={!isSaving}
              />

              <Text style={styles.label}>Autor</Text>
              <TextInput
                style={styles.input}
                placeholder="Gabriel García Márquez"
                placeholderTextColor="#7f8c8d"
                value={autor}
                onChangeText={setAutor}
                editable={!isSaving}
              />

              <Text style={styles.label}>Género</Text>
              <TextInput
                style={styles.input}
                placeholder="Fantasia, CiFi, Drama"
                placeholderTextColor="#7f8c8d"
                value={genero}
                onChangeText={setGenero}
                editable={!isSaving}
              />

              {isSaving ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#000" />
                  <Text style={styles.loadingText}>Guardando en favoritos...</Text>
                </View>
              ) : (
                <Pressable
                  style={({ pressed }) => [
                    styles.botonAgregar,
                    pressed && styles.botonAgregarPresionado
                  ]}
                  onPress={agregarLibro}
                >
                  <Text style={styles.botonAgregarTexto}>Agregar libro</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.listaSeccion}>
              <Text style={styles.listaTitle}>Libros Leídos ({libros.length})</Text>

              {libros.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No has agregado ningún libro aún.</Text>
                </View>
              ) : (
                <FlatList
                  data={libros}
                  keyExtractor={(item) => item.id}
                  renderItem={renderLibro}
                  scrollEnabled={false}
                />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContent: {
    alignItems: 'center',
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  splashSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    fontSize: 14,
  },
  botonAgregar: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  botonAgregarPresionado: {
    opacity: 0.8,
  },
  botonAgregarTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  loadingText: {
    marginTop: 5,
    fontSize: 12,
    color: '#000',
  },
  listaSeccion: {
    marginBottom: 20,
  },
  listaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emptyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  emptyText: {
    color: '#000',
    fontSize: 14,
  },
  libroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  libroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  libroDetalle: {
    flex: 1,
  },
  libroTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  libroAutor: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
  },
  botonEliminar: {
    padding: 5,
  },
  botonEliminarPresionado: {
    opacity: 0.6,
  },
  botonEliminarTexto: {
    fontSize: 16,
    color: '#d9534f',
    fontWeight: 'bold',
  },
});

