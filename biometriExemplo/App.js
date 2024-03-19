import { StatusBar } from 'expo-status-bar';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import moment from 'moment';

import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react';

export default function App() {
  const [history, setHistory] = useState({})
  const [authenticated, setAuthenticated] = useState(false)
  const [biometricExist, setBiometricExist] = useState(false)
  async function CheckExistAuthenticates(){
    //Validar se o aparelho tem o acesso a biometria
    const compatible = await LocalAuthentication.hasHardwareAsync()

    setBiometricExist(compatible)
    //Consulta as validações existente
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
    // console.log(Authe)
  }

  async function handleAuthentication(){
    const biometric = await LocalAuthentication.isEnrolledAsync();

    //Validar se exite uma biometria cadastrada

    if(!biometric){
      return Alert.alert(
        "Falha ao Logar", 
        "Não foi encontrado nenhuma biometria cadastrada"
      )
    }

    //Caso exista ->
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login com Biometria'
    })

    setAuthenticated( auth.success)

    if(auth.success){
      SetHistory()
    }

  }

  //A gente salva uma chave 
  async function SetHistory(){
    const objAuth = {
      dateAuthenticate : moment().format("DD/MM/YYYY HH:mm:ss")
    }

    await AsyncStorage.setItem("authenticate", JSON.stringify(objAuth))

    await setHistory(objAuth)
  }


  //Captura a chave que a gente acabou de salvar
  async function GetHistory(){
    const objAuth = await AsyncStorage.getItem("authenticate")

    if(objAuth)
    {
      setHistory(JSON.parse(objAuth))
    }
  }

  //Faz as funções serem acionadas
  useEffect(() => {
    CheckExistAuthenticates()

    GetHistory()
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        { biometricExist ? 'Seu dispositivo é compatível com a Biometria' : 'Seu dispositivo não suporta o FaceId/ Biometria'}
        </Text>

        <TouchableOpacity style={styles.btnAuth} onPress={handleAuthentication}>
          <Text style={styles.txtAuth}> Autenticar acesso</Text>
        </TouchableOpacity>
        
        <Text style={[styles.txtReturn,{color: authenticated ? 'green' : 'red'}]}>
          {authenticated ? 'Autenticado' : ' Não Autenticado'}
        </Text>

        {
          history.dateAuthenticate 
          ? <Text style={styles.txtHistory}> Último Acesso em {history.dateAuthenticate}</Text> : null
        }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    fontSize: 20,
    backgroundColor: '#fff',
    textAlign: 'center',
    lineHeight: 30,
    width: '70%'
  },
  btnAuth:{
    padding: 16,
    borderRadius: 15,
    margin: 20,
    backgroundColor: '#ff8800'
  },
  txtAuth:{
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'

  },
  txtReturn:{
    fontSize: 22,
    textAlign: 'center',
    marginTop: 50
  },
  txtHistory:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#858383',
    position: 'absolute',
    bottom: 120
  }
});
