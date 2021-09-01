import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AzureInstance, AzureLoginView } from "react-native-azure-ad-2";

const credentials = {
  client_id: "cbfd2433-6712-4e6a-9f77-38b8696fcf34",
  client_secret: "L11-xHe_0-1is9pwnQ2be__1P0kr.ibP4Y",
  scope:
    "User.ReadBasic.All User.Read.All User.ReadWrite.All Mail.Read offline_access",
};

export default function App() {
  // const [azureLoginObject, setAzureLoginObject] = useState(null);
  // const [loginSuccess, setLoginSuccess] = useState(false);
  // const azureInstance = new AzureInstance(credentials);
  // const onLoginSuccess = (azInstance) => {
  //   const getUserInfo = async (instance) => {
  //     const response = await instance.getUserInfo().catch((err) => {
  //       console.error(err);
  //     });
  //     if (response) {
  //       setLoginSuccess(true);
  //       setAzureLoginObject(response);
  //     }
  //   };

  //   return () => getUserInfo(azInstance);
  // };
  // if (!loginSuccess) {
  //   return (
  //     <AzureLoginView
  //       azureInstance={azureInstance}
  //       loadingMessage="Requesting access token"
  //       onSuccess={onLoginSuccess(azureInstance)}
  //     />
  //   );
  // }
  // const { userPrincipalName, givenName } = azureLoginObject;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome test</Text>
      <Text style={styles.text}>You logged into Azure with</Text>
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
  text: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});
