# React-native-azure-ad-2
Trying to access a Microsoft Accounts is kind of bizarre. Microsoft previously separated their user accounts into two different domains, one for their cloud platform –  Microsoft Azure – and another for general users who are using their services like Hotmail, One Drive or Xbox.

This meant developers had to use different authentication endpoints in order to authenticate users from different services.

:scream: :scream: :scream: :scream:

Thankfully they recently converged their disparate authentication service into a single service called “v2.0 endpoint” which allows you to use OAuth authentication for whichever Microsoft service account you have.

Authenticating a user via the v2 endpoint will give us access to a custom bearer token, this token allows us to consume REST APIs from the Microsoft Graph (a single end point into all Microsoft services) and allows your app to request for simple user data, for example first name, last name, email, and get other information like email messages, contacts and notes associated with their accounts.

This module is developed to help developers to integrated Microsoft V2 endpoint into their React-native app in a painless way.
___

## Table of content
- [React-native-azure-ad-2](#react-native-azure-ad-2)
  - [Table of content](#table-of-content)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Example](#example)

## Installation
Install package from `npm`
```sh
$ npm install -s @shedaltd/react-native-azure-ad-2
```

## Usage
First, import the component

```javascript
import {AzureInstance, AzureLoginView} from '@shedaltd/react-native-azure-ad-2'
```
Then create an AzureInstance by using Microsoft application credential that we have registered.  Also, adding application scope in order to ask users to consent when they login. For more information about scope see [Microsoft blog](https://azure.microsoft.com/en-us/documentation/articles/active-directory-v2-scopes/).
```javascript
const CREDENTIAILS = {
    client_id: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    client_secret: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    redirect_uri: 'xxxx',
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
            onCancel={this._onLoginCancel}
        />
    );
}
```
When combine all parts together, it will look like this.

```javascript
import React from 'react';
import {AppRegistry, View} from 'react-native';
import {AzureInstance, AzureLoginView} from './azure';

// CONSTANT
const CREDENTIAILS = {
    client_id: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    client_secret: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    redirect_uri: 'xxxx',
    scope: 'User.ReadBasic.All Mail.Read offline_access'
};

export default class azureAuth extends React.Component {
    constructor(props){
        super(props);
        
        this.azureInstance = new AzureInstance(CREDENTIAILS);
        this._onLoginSuccess = this._onLoginSuccess.bind(this);
        this._onLoginCancel = this._onLoginCancel.bind(this);
    }
    
    _onLoginSuccess(){
        this.azureInstance.getUserInfo().then(result => {
            console.log(result);
        }).catch(err => {
            console.log(err);
        })
    }
    
    _onLoginCancel(){
        // Show cancel message
    }

    render() {
        return (
            <AzureLoginView
                azureInstance={this.azureInstance}
                loadingMessage="Requesting access token"
                onSuccess={this._onLoginSuccess}
                onCancel={this._onLoginCancel}
            />
        );
    }
}

AppRegistry.registerComponent('azureAuth', () => azureAuth);
```

## Example

To see see an example app using the library have a look at  the [Example Project](example/README.md)