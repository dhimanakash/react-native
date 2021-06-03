import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { auth } from "../../firebase";

const LoginScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <>
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      </>
    );
  }

  const userLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      alert("Please, Fill all the details");
      return;
    }
    try {
      const userResult = await auth.signInWithEmailAndPassword(email, password);

      setLoading(false);
    } catch (err) {
      alert("Something Went Wrong !");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.text}>Chat Bot 2.0</Text>
      <Image
        style={styles.img}
        source={require("../../assets/images/logo.png")}
      />
      <View style={styles.inputBox}>
        <TextInput
          label="Email:"
          value={email}
          onChangeText={(text) => setEmail(text)}
          mode="outlined"
        />
        <TextInput
          label="Password:"
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          mode="outlined"
        />

        <Button
          style={styles.button}
          mode="outlined"
          onPress={() => userLogin()}
        >
          Login
        </Button>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("signup");
          }}
        >
          <Text style={{ textAlign: "center" }}>
            Dont have a account ?
            <Text style={{ color: "#4287f5" }}>{`   Sign up`}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 28,
    color: "#7c8387",
    fontWeight: "bold",
    marginVertical: 10,
    fontFamily: "sans-serif-medium",
  },
  img: {
    width: 250,
    height: 200,
    marginVertical: "20%",
  },
  inputBox: {
    width: "90%",
  },
  button: {
    marginVertical: 10,
  },
  indicator: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
