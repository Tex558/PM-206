//zona1: importaciones
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Saludo} from './components/Saludo';
import { Salud2 } from './components/Salud2';
import { Perfil } from './components/Perfil';

//Zona2: main - hogar de la aplicación, donde se renderizan los componentes y se define la estructura visual de la app
export default function App() {
  return (

      <View style={styles.container}>
      <Text>------------Componente Nativo------------</Text>
      <Image source={require('./assets/wave.png')}/>
      <Text>Hola mundo RN!</Text>

      <Text>------------Componente Simple------------</Text>
      <Saludo></Saludo>   

      <Text>------------Componente Compuesto------------</Text> 
      <Salud2></Salud2> 

      <Text>------------Componente Perfi  l------------</Text>
      <Perfil></Perfil>

      <StatusBar style="auto" />
    </View>
  );
}
//Zona3: estilos - define los estilos para los componentes de la aplicación, en este caso, el contenedor principal
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});