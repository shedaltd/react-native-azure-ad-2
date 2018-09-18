export default class AzureInstance {
    constructor(credentials) {
        this.authority = 'https://login.microsoftonline.com/common';
        this.authorize_endpoint = '/oauth2/v2.0/authorize';
        this.redirect_uri = credentials.redirect_uri || 'https://localhost:3000/login';
        this.token_endpoint ='/oauth2/v2.0/token';
        this.client_id = credentials.client_id;
        this.client_secret = credentials.client_secret;
        this.scope = credentials.scope;
        this.token = {};

        // function binding
        this.getConfig = this.getConfig.bind(this);
        this.setToken = this.setToken.bind(this);
        this.getToken = this.getToken.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
    }

    getConfig(){
        return {
            authority: this.authority,
            authorize_endpoint: this.authorize_endpoint,
            token_endpoint: this.token_endpoint,
            client_id: this.client_id,
            client_secret: this.client_secret,
            redirect_uri: this.redirect_uri,
            scope: this.scope,
        }
    }

    setToken(token){
        this.token = token;
    }

    getToken(){
        return this.token;
    }

    getUserInfo(): Promise {
        if (this.token === undefined){
            throw new Error("Access token is undefined, please authenticate using Auth first");
        }

        return fetch("https://graph.microsoft.com/v1.0/me", {
                    headers: {
                        'Authorization': "Bearer " + this.token.accessToken,
                    }
            }).then(response => {
                // return blob object
                return response.json()
            })
            .then(response => {
                // read blob object back to json
                return response
            }).catch(err => {
                // incase of error reject promise
                throw new Error(err);
            });
    }
}