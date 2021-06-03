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
import * as ImagePicker from "expo-image-picker"; //gives access to camera roll and gallery
import { auth, db, store } from "../../firebase";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [showNext, setShowNext] = useState(false);
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

  const userSignup = async () => {
    setLoading(true);
    if (!email || !password || !image || !name) {
      alert("Please, Fill all the details");
      return;
    }
    try {
      const userResult = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      db.collection("users").doc(userResult.user.uid).set({
        name: name,
        email: userResult.user.email,
        uid: userResult.user.uid,
        pic: image,
      });
      setLoading(false);
    } catch (err) {
      alert("Something Went Wrong !");
    }
    alert("Successfully added");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      // const reference = store.ref(`/profileimages/${result.uri}`);
      // setImage(reference);

      //storing the image into firebase storage

      const uploadTask = store
        .ref()
        .child(`/userprofile/${Date.now()}`) //Date.now() Return the number of milliseconds since 1970/01/01
        .putString(result.uri);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress === 100) {
            alert("Uploaded Successful");
          }
          console.log(progress);
        },
        (error) => {
          alert("error uploading image");
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            // console.log("File available at", downloadURL);
            setImage(downloadURL);
          });
        }
      );
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
        {!showNext && (
          <>
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
          </>
        )}

        {showNext ? (
          <>
            <TextInput
              label="Name:"
              value={name}
              onChangeText={(text) => setName(text)}
              mode="outlined"
            />
            <Button
              style={styles.button}
              mode="outlined"
              onPress={() => {
                pickImage();
              }}
            >
              Upload Picture
            </Button>
            <Button
              style={styles.button}
              mode="outlined"
              disabled={image ? false : true}
              onPress={() => userSignup()}
            >
              SignUp
            </Button>
          </>
        ) : (
          <Button
            style={styles.button}
            mode="outlined"
            onPress={() => {
              setShowNext(true);
            }}
          >
            Next
          </Button>
        )}
        <TouchableOpacity
          onPress={() => {
            navigation.goBack("login");
          }}
        >
          <Text style={{ color: "black", textAlign: "center" }}>
            Already have an account ?{" "}
            <Text style={{ color: "#4287f5" }}>{` Login`}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

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
