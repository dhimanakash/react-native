import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { auth, db } from "../../firebase";
import Feather from "react-native-vector-icons/Feather";
import { Button } from "react-native-paper";

const AccountScreen = ({ user }) => {
  //   console.log(profile.pic);
  const [profile, setProfile] = useState("");
  useEffect(() => {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((docSnap) => {
        setProfile(docSnap.data());
      });
  }, []);

  if (!profile) {
    return (
      <>
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={{ uri: profile.pic }} />
      <Text style={styles.text}>Name - {profile.name}</Text>
      <View style={{ flexDirection: "row" }}>
        <Feather name="mail" size={30} />
        <Text style={styles.text}>{profile.email}</Text>
      </View>
      <Button
        style={styles.button}
        mode="outlined"
        onPress={() => auth.signOut()}
      >
        LogOut
      </Button>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  //   indicator: {
  //     flex: 1,
  //     justifyContent: "center",
  //     alignItems: "center",
  //   },
  img: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    backgroundColor: "black",
  },
  text: {
    fontSize: 23,
    marginLeft: 5,
  },
  button: {},
});
