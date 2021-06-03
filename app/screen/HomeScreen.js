import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FAB } from "react-native-paper";
import { db } from "../../firebase";

const HomeScreen = ({ user, navigation }) => {
  // console.log(user);
  const [users, setUsers] = useState(null);
  const getUsers = async () => {
    const querySnap = await db
      .collection("users")
      .where("uid", "!=", user.uid)
      .get(); //fetch the users from the firestore
    const allUsers = querySnap.docs.map((docSnap) => docSnap.data()); //storing data from users to all users
    // console.log(allUsers);
    setUsers(allUsers);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const RenderCard = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("chat", { name: item.name, uid: item.uid })
        }
      >
        <View style={styles.myCard}>
          <Image source={{ uri: item.pic }} style={styles.img} />
          <View>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>{item.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={users}
        renderItem={({ item }) => {
          return <RenderCard item={item} />;
        }}
        keyExtractor={(item) => item.uid}
      />
      <FAB
        style={styles.fab}
        color="black"
        icon="face-profile"
        onPress={() => navigation.navigate("profile")}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "black",
  },
  text: {
    fontSize: 18,
    marginLeft: 15,
  },
  myCard: {
    flexDirection: "row",
    margin: 3,
    padding: 4,
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomColor: "grey",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
  },
});
