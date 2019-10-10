import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {AzureInstance, AzureLoginView} from 'react-native-azure-ad-2';

const credentials = {
  client_id: '2fa55851-89e0-4ccf-8b86-2a682bdb13d9',
  client_secret: 'prJaOuSFMppLGa9E2bCScRR',
  scope: 'User.ReadBasic.All User.Read.All User.ReadWrite.All Mail.Read offline_access'
};

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      azureLoginObject: {},
      loginSuccess: false
    };
		this.azureInstance = new AzureInstance(credentials);
	  	this.azureInstance.redirect_uri = 'YOUR REDIRECT ADDRESS HERE';
    		this.azureInstance.authority = 'https://login.microsoftonline.com/YOUR-TENANT-ID-HERE';
		this._onLoginSuccess = this._onLoginSuccess.bind(this);
	}

	_onLoginSuccess(){
		this.azureInstance.getUserInfo().then(result => {
			this.setState({
        loginSuccess: true,
        azureLoginObject: result
      });
      console.log(result);
		}).catch(err => {
			console.log(err);
		})
  }
  

  render() {

    if (!this.state.loginSuccess) {

      return (<AzureLoginView
          azureInstance={this.azureInstance}
          loadingMessage="Requesting access token"
          onSuccess={this._onLoginSuccess}
        />)
    }

    const {userPrincipalName, givenName} = this.state.azureLoginObject;
    
    return (
      <View style={styles.container}>
				<Text style={styles.text}>Welcome {givenName}</Text> 
				<Text style={styles.text}>You logged into Azure with {userPrincipalName}</Text> 
			</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5
	}
});
