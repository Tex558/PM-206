//zona1: importaciones
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Perfil } from '../components/Perfil';

//Zona2: main - hogar de la aplicación, donde se renderizan los componentes y se define la estructura visual de la app
export default function TarjetasScreen() {
  return (

      <View style={styles.container}>

      <Perfil estiloE={styles.tarjetaR} nombre ="Emiliano J" carrera ="Sistemas" materia ="P movil" cuatri ="9"></Perfil>

      <Perfil   
      estiloE={styles.tarjetaV}
      nombre ="Alex Rios" 
      carrera ="Negocios" 
      materia ="Bisne" 
      cuatri ="7">
      </Perfil>

      <Perfil   
      estiloE={styles.tarjetaB}
      nombre ="Saul Silva" 
      carrera ="Negocios" 
      materia ="Bisne" 
      cuatri ="7">
      </Perfil>
      
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
    justifyContent: 'space-evenly',
    flexDirection: 'row'
  },
  tarjetaR:{backgroundColor:'#FF6B6B'},
  tarjetaV:{backgroundColor:'#6BCB77'},
  tarjetaB:{backgroundColor:'#6ba0cb'}
});