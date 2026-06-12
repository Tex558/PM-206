import {Button, Text, Image, View} from 'react-native';

export const Salud2 = (props) => {
    return(
        <View>
        <Text>Soy un componente propio</Text>
        <Image source={require('../assets/wave.png')}/>
        <Button title="Hola 206"/>
        </View>
    );
}