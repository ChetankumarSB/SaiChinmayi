import React, { useState,useEffect,Component } from "react";
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import Home from './screens/Home';
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default App = () => {

  BackHandler.addEventListener("hardwareBackPress", function() {
    return true;
  });
  
	return (
		<NavigationContainer>
      <Stack.Navigator>
	    <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
        <Stack.Screen name="Home" component={Home} options={{headerShown:false}}  />
      </Stack.Navigator>
    </NavigationContainer>
	)
}
 
const Login = ({navigation}) => {
  const [phoneNumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [dlog, setdlog] = useState("");

  const add = async () => {
    try {
    await AsyncStorage.setItem('phn', phoneNumber)
    }
    catch (e){
    console.error(e);
    }
}

const get = async () => {
  try {
  const value = await AsyncStorage.getItem('phn')
  if(value !== null) {
    setdlog(value)
    setPhonenumber(value)
    navigation.navigate('Home');
Axios.get("https://saichinmayi.herokuapp.com/api/v1/user/read")
.then((response) => {
  checkAc(response.data);
})
.catch((error) => {
    Snackbar.show({
    text: 'Please check your internet connection', 
    duration: Snackbar.LENGTH_SHORT,
    action: {
      textColor: "#CAD5E2",
    },
  });
});

const checkAc= (data) => {
  for (let i = 0; i < data.length; i++) {
    if (value==data[i].phoneNumber) {
      if(data[i].active!==true){
         navigation.navigate('Login');
      }else{
        navigation.navigate('Home');
        }
       }
      }
     }
    }
  } catch (e){
  console.error(e);
  }
}

useEffect(() => {
    get();
    setPhonenumber(phoneNumber)
  },[]);

  const nav = () => { 
    Axios.get("https://saichinmayi.herokuapp.com/api/v1/user/read")
    .then((response) => {
      checkLogin(response.data);
    })
    .catch((error) => {
        Snackbar.show({
        text: 'Something went wrong, please try again', 
        duration: Snackbar.LENGTH_SHORT,
        action: {
          textColor: "#CAD5E2",
        },
      });
      console.log(error);
    });

    const checkLogin= (data) => {
      for (let i = 0; i < data.length; i++) {
        if (phoneNumber==data[i].phoneNumber) {
            if (password==data[i].code) {
              if(data[i].active){
              navigation.navigate('Home');
              setPhonenumber(phoneNumber);
              add();
              }
            }      
        } else { 
          Snackbar.show({
            text: 'Enter valid credentials. Try again.', 
            duration: Snackbar.LENGTH_SHORT,
            action: {
              textColor: "#CAD5E2",
            },
          }); 
        }
      }
    }
  };

  return (
    dlog ?
    <View style={styles.container}> 
    <Image style={styles.image} source={require("./src/panther1.png")} />
    </View>
    :
     <View style={styles.container}> 
    <Image style={styles.image} source={require("./src/panther1.png")} />
    <View style={styles.inputView}>
      <TextInput
        style={styles.TextInput}
        placeholder="Phone Number"
        placeholderTextColor="#CAD5E2"
    keyboardType = 'numeric'
        onChangeText={(phoneNumber) => setPhonenumber(phoneNumber)}
      />
    </View>
    <View style={styles.inputView}>
      <TextInput
        style={styles.TextInput}
        placeholder="Password"
    placeholderTextColor="#CAD5E2"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
    </View>
    <TouchableOpacity style={styles.loginBtn}
     onPress={nav}>
      <Text style={styles.loginText}>LOGIN</Text>
    </TouchableOpacity>
  </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
 
  image: {
	width: 400,
    height: 400,
  },
 
  inputView: {
    backgroundColor: "#758283",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
 
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    color: "#CAD5E2"
  },
 
  loginText: {
	color: "#CAD5E2",
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#0D0D0D",
  },
  containerSB: {
    marginTop: 30,
    padding: 2,
  },
  itemSB: {
    backgroundColor: "#f5f520",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
