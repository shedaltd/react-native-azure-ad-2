import uuid from 'uuid';
import querystring from 'query-string';
import RNFetchBlob from 'react-native-fetch-blob';
import URL from 'url';
import {
    Buffer
} from 'buffer';

const { Blob } = RNFetchBlob.polyfill;
const { fs } = RNFetchBlob;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
window.fetch = new RNFetchBlob.polyfill.Fetch({
  // enable this option so that the response data conversion handled automatically
  auto: true,
  // when receiving response data, the module will match its Content-Type header
  // with strings in this array. If it contains any one of string in this array,
  // the response body will be considered as binary data and the data will be stored
  // in file system instead of in memory.
  // By default, it only store response data to file system when Content-Type
  // contains string `application/octet`.
  binaryContentTypes: ['image/', 'video/', 'audio/', 'foo/'],
}).build();

export default class Auth {

    constructor(instance) {
        const config = instance.getConfig();

        this.authority = config.authority;
        this.authorize_endpoint = config.authorize_endpoint;
        this.token_endpoint = config.token_endpoint;
        this.client_id = config.client_id;
        this.client_secret = config.client_secret;
        this.redirect_uri = config.redirect_uri;
        this.scope = config.scope;

        // function binding
        this.getAuthUrl = this.getAuthUrl.bind(this);
        this._request = this._request.bind(this);
    }

    getAuthUrl() {
        return this.authority + this.authorize_endpoint +
            '?client_id=' + this.client_id +
            '&response_type=code' +
            '&redirect_uri=' + this.redirect_uri +
            '&scope=' + this.scope +
            '&response_mode=query' +
            '&nonce=' + uuid.v4() +
            '&state=abcd';
    }

    _request(params: any): Promise {
        const post_data = querystring.stringify(params);

        // create request endpoint
        const endpoint = this.authority + this.token_endpoint;

        // set port based on http protocol
        var parsedUrl = URL.parse(endpoint, true);
        if (parsedUrl.protocol == "https:" && !parsedUrl.port) {
            parsedUrl.port = 443;
        }

        // set request header
        var realHeaders = {};
        realHeaders['Host'] = parsedUrl.host;

        var queryStr = querystring.stringify(parsedUrl.query);
        if (queryStr) queryStr = "?" + queryStr;

        if (post_data) {
            if (Buffer.isBuffer(post_data)) {
                realHeaders["Content-Length"] = post_data.length;
            } else {
                realHeaders["Content-Length"] = Buffer.byteLength(post_data);
            }
        } else {
            realHeaders["Content-length"] = 0;
        }

        realHeaders["Content-Type"] = 'application/x-www-form-urlencoded';

        // create request option object
        const options = {
            host: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + queryStr,
            method: "POST",
            headers: realHeaders
        };

        const payload = Object.assign({
            body: post_data
        }, options);

        // request token
        return RNFetchBlob.fetch(payload.method, endpoint, { 'Content-Type': 'application/x-www-form-urlencoded'}, payload.body)
        .then(response => {
                // return blob object
                return response.json()
            })
            .then(response => {
                // read blob object back to json
                return {
                    expires_in: response.expires_in + Math.round(+new Date()/1000),
                    accessToken: response.access_token,
                    refreshToken: response.refresh_token
                }
            }).catch(err => {
                // incase of error reject promise
                return new Error(err);
            });
    }

    getTokenFromCode(code: string): Promise {
        var params = {
            client_id: this.client_id,
            client_secret: this.client_secret,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: this.redirect_uri,
            response_mode: 'form_post',
            nonce: uuid.v4(),
            state: 'abcd'
        }

        return this._request(params);
    }

    getTokenFromRefreshToken(refreshToken: string): Promise {
        var params = {
            client_id: this.client_id,
            client_secret: this.client_secret,
            refresh_token: code,
            grant_type: 'refresh_token',
            redirect_uri: this.redirect_uri,
            response_mode: 'form_post',
            nonce: uuid.v4(),
            state: 'abcd'
        }

        return this._request(params);
    }
}