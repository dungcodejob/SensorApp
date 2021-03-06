

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import auth from '@react-native-firebase/auth';

import { TextInput } from "react-native-gesture-handler";

function SignInScreen({ navigation }) {

  const [check_textInputChange, setCheck_textInputChange] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const textInputChange = (value) => {
    if (value) {
      // this.setState({
      //     check_textInputChange: true
      // });
      setEmail(value);
      setCheck_textInputChange(true);
    } else {
      // this.setState({
      //     check_textInputChange: false
      // });

      setCheck_textInputChange(false);
    }
  }

  // const focusNextField = (id) => {
  //   this.inputs[id].focus();
  // }

  const signIn = async () => {
    console.log("Login button")

    if(email && password){
      
      try {
        let response = await auth().signInWithEmailAndPassword(email, password)
        if (response && response.user) {
          console.log("Login successful")
          console.log(auth().currentUser.email) // This will using for check User ID
          navigation.navigate('Home')
        }
      } catch (e) {
        console.log(e)
        if (e.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
          Alert.alert('That email address is already in use!');
        }

        if (e.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
          Alert.alert('That email address is invalid!');
        }

        if (e.code === 'auth/user-not-found') {
          console.log('User not exist!');
          Alert.alert('User not exist!');
        }

        if (e.code === 'auth/wrong-password') {
          console.log('Wrong username or password!');
          Alert.alert('Wrong username or password!');
        }
        
      }
    }
    else{
      Alert.alert('email hoặc password không được phép để trống');
    }

     
    
      
  }




  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <Text style={styles.text_header}>Welcome AFarm!</Text>

      </View>

      <View style={styles.footer}>
        <Text style={styles.text_footer}>E-MAIL</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#05375a" size={20} />
          <TextInput
            placeholder="Your email..."
            style={styles.textInput}
            onChangeText={text => textInputChange(text)}
          />

          {check_textInputChange ? (
            <Feather name="check-circle" color="green" size={20} />
          ) : null}
        </View>

        <Text style={(styles.text_footer, { marginTop: 35 })}>Password</Text>
        <View style={styles.action}>
          <Feather name="lock" color="#05375a" size={20} />
          <TextInput
            placeholder="Your password..."
            secureTextEntry={true}
            style={styles.textInput}
            value={password}
            onChangeText={text =>
              //   this.setState({
              //     password: text
              //   })
              setPassword(text)
            }
          />

          <Feather name="eye-off" color="gray" size={20} />
        </View>

        <Text style={{ color: "#009bd1", marginTop: 15, textAlign: "right" }}>
          Forgot password?
            </Text>

        <View style={styles.button}>



          <TouchableOpacity
            onPress={() => signIn()}
            style={[styles.signIn, {

              backgroundColor: "#5db8fe"
            }]}>
            <Text style={[styles.textSign, { color: 'white' }]}>
              Sign In
                </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
            style={[styles.signIn, {
              borderColor: "#4dc2f8",
              borderWidth: 1,
              marginTop: 15
            }]
            }>

            <Text style={[styles.textSign, { color: "#4dc2f8" }]}>
              Sign Up
                </Text>
          </TouchableOpacity>
        </View>


      </View>



      <Text>Get started</Text>
    </View>
  );
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05375a"
  },

  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50
  },

  footer: {
    flex: 3,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30
  },

  text_header: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30
  },

  text_footer: {
    color: "#05375a",
    fontSize: 18
  },

  action: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent:"center",
    alignItems:"center",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5
  },

  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a"
  },

  button: {
    alignItems: "center",
    marginTop: 50,
  },

  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,

  },

  textSign: {
    fontSize: 18,
    fontWeight: "bold"
  }
});

export default SignInScreen