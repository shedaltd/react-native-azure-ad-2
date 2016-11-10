# React-native-azure-ad-2

* [Installation](#installation)
* Usage
* Components
    * AzureInstance
    * AzureLoginView
    * Auth

### Installation
Install package from `npm`
```sh
$ npm install -s react-native-azure-ad-2
```

### Usage

First, import the component

```javascript
import {AzureInstance, AzureLoginView} from 'react-native-azure-ad-2'
```
Then create an AzureInstance by using Microsoft application credential that we have registered.  Also, adding application scope in order to ask users to consent when they login. For more information about scope see [Microsoft blog](https://azure.microsoft.com/en-us/documentation/articles/active-directory-v2-scopes/).
```javascript
const CREDENTIAILS = {
    client_id: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    client_secret: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    scope: 'User.ReadBasic.All Mail.Read offline_access'
};

const Instance = new AzureInstance(CREDENTIAILS);
```
After that, create an AzureLoginView where you want the login WebView to be rendered and pass along with azureInstance that we have create from the last step.

```javascript
render( ) {
    return (
        <AzureLoginView
            azureInstance={this.azureInstance}
            loadingMessage="Requesting access token"
            onSuccess={this._onLoginSuccess}
        />
    );
}
```
When combine all parts together, it will look like this.

```javascript
import React from 'react';
import { AppRegistry, View } from 'react-native';
import {AzureInstance, AzureLoginView} from './azure';

// CONSTANCE
const CREDENTIAILS = {
    client_id: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    client_secret: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    scope: 'User.ReadBasic.All Mail.Read offline_access'
};

export default class azureAuth extends React.Component {
	constructor(props){
		super(props);
		
		this.azureInstance = new AzureInstance(CREDENTIAILS);
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
```
