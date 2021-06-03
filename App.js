import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import SignupScreen from "./app/screen/SignupScreen";
import LoginScreen from "./app/screen/LoginScreen";
import { auth } from "./firebase";
import HomeScreen from "./app/screen/HomeScreen";
import ChatScreen from "./app/screen/ChatScreen";
import AccountScreen from "./app/screen/AccountScreen";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#4287f5",
  },
};

const Stack = createStackNavigator();

const NavigationScreen = () => {
  const [user, setUser] = useState("");
  useEffect(() => {
    const unregister = auth.onAuthStateChanged((userExist) => {
      if (userExist) setUser(userExist);
      else setUser("");
    });

    return () => {
      unregister();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            {/* Home Screen Navigation */}
            <Stack.Screen
              name="Home"
              options={{
                headerRight: () => (
                  <MaterialIcons
                    name="account-circle"
                    size={34}
                    color="black"
                    style={{ marginRight: 10 }}
                    onPress={() => auth.signOut()}
                  />
                ),
                title: "Home",
              }}
            >
              {(props) => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            {/* Chat Screen Navigation */}
            <Stack.Screen
              name="chat"
              options={({ route }) => ({ title: route.params.name })}
            >
              {(props) => <ChatScreen {...props} user={user} />}
            </Stack.Screen>

            {/* AccountScreen Navigation */}
            <Stack.Screen name="profile">
              {(props) => <AccountScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            {/* Login Screen Navigation */}
            <Stack.Screen
              name="login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            {/* Signup Screen Navigation */}
            <Stack.Screen
              name="signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <>
      <View style={styles.container}>
        <PaperProvider theme={theme}>
          <StatusBar style="light" backgroundColor="grey" />
          <NavigationScreen />
        </PaperProvider>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 25,
  },
  scrollView: {
    marginHorizontal: 0,
  },
});
