import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { CLIENT_SECRET_KEY } from "@env";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AzureInstance, AzureLoginView } from "react-native-azure-ad-2";
import RCTNetworking from "react-native/Libraries/Network/RCTNetworking";

const { Navigator, Screen } = createNativeStackNavigator();
const buttonColour = Platform.OS === "ios" ? "#fff" : "#007AFF";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Get ready to login to Azure</Text>
      <View style={styles.button}>
        <Button
          onPress={() => navigation.navigate("SignIn")}
          title="Sign In"
          style={styles.title}
          color={buttonColour}
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const SignInScreen = ({ navigation }) => {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [azureLoginObject, setAzureLoginObject] = useState({});
  const credentials = {
    client_id: "cbfd2433-6712-4e6a-9f77-38b8696fcf34",
    client_secret: CLIENT_SECRET_KEY,
    redirect_uri: "http://localhost:3000",
    scope:
      "User.ReadBasic.All User.Read.All User.ReadWrite.All Mail.Read offline_access",
  };
  const azureInstance = new AzureInstance(credentials);

  const onLoginSuccess = async () => {
    try {
      const result = await azureInstance.getUserInfo();
      setLoginSuccess(true);
      setAzureLoginObject(result);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("error getting user info");
      console.error(err);
    }
  };

  const signOut = () =>
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          RCTNetworking.clearCookies(() => {});
          setLoginSuccess(false);
          navigation.navigate("Home");
        },
      },
    ]);

  if (!loginSuccess) {
    return (
      <AzureLoginView
        azureInstance={azureInstance}
        loadingMessage="Requesting access token again"
        onSuccess={onLoginSuccess}
      />
    );
  }

  const { userPrincipalName, givenName } = azureLoginObject;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome {givenName}</Text>
      <Text style={styles.text}>
        You logged into Azure with {userPrincipalName}
      </Text>
      <View style={styles.button}>
        <Button
          onPress={signOut}
          title="Sign Out"
          style={styles.title}
          color={buttonColour}
          accessibilityLabel="Sign Out of Azure"
        />
      </View>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Navigator>
        <Screen name="Home" component={HomeScreen} />
        <Screen name="SignIn" component={SignInScreen} />
      </Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 4,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  text: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});
