import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import {AzureInstance, AzureLoginView} from './azure';
// The application registration (must match Azure AD config)
var credentials = {
  client_id: '2fa55851-89e0-4ccf-8b86-2a682bdb13d9',
  client_secret: 'prJaOuSFMppLGa9E2bCScRR',
  scope: 'User.ReadBasic.All User.Read.All User.ReadWrite.All Mail.Read offline_access'
};

export default class azureAuth extends React.Component {
	constructor(props){
		super(props);
		this.azureInstance = new AzureInstance(credentials);

		this._onLoginSuccess = this._onLoginSuccess.bind(this);
	}

	_onLoginSuccess(){
		this.azureInstance.getUserInfo().then(result => {
			console.log(result);
		}).catch(err => {
			console.log(err);
		})
	}


    render() {
        return (
            <AzureLoginView
            	azureInstance={this.azureInstance}
            	loadingMessage="Requesting access token"
            	onSuccess={this._onLoginSuccess}
            />
        );
    }
}

AppRegistry.registerComponent('azureAuth', () => azureAuth);