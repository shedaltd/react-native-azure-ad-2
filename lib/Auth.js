import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import url from "url";
import { Buffer } from "buffer";

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
    const authUrl = new URL(this.authority + this.authorize_endpoint);
    authUrl.searchParams.append("client_id", this.client_id);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("redirect_uri", this.redirect_uri);
    authUrl.searchParams.append("scope", this.scope);
    authUrl.searchParams.append("response_mode", "query");
    authUrl.searchParams.append("nonce", uuidv4());
    authUrl.searchParams.append("state", "abcd");

    return authUrl.href;
  }

  _request(params: any): Promise {
    const searchParams = new URLSearchParams(params);
    const post_data = searchParams.toString();

    // create request endpoint
    const fullTokenEndpoint = this.authority + this.token_endpoint;

    // set port based on http protocol
    var parsedUrl = url.parse(fullTokenEndpoint, true);
    if (parsedUrl.protocol === "https:" && !parsedUrl.port) {
      parsedUrl.port = 443;
    }

    // set request header
    var realHeaders = {};
    realHeaders["Host"] = parsedUrl.host;

    let queryStr = new URLSearchParams(parsedUrl.query).toString();
    if (queryStr) queryStr = "?" + queryStr;

    if (post_data) {
      realHeaders["Content-Length"] = Buffer.isBuffer(post_data)
        ? post_data.length
        : Buffer.byteLength(post_data);
    } else {
      realHeaders["Content-Length"] = 0;
    }

    realHeaders["Content-Type"] = "application/x-www-form-urlencoded";

    // create request option object
    const options = {
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + queryStr,
      method: "POST",
      headers: realHeaders,
    };

    const payload = Object.assign(
      {
        body: post_data,
      },
      options
    );

    // request token
    return fetch(fullTokenEndpoint, payload)
      .then((response) => {
        // return blob object
        return response.json();
      })
      .then((response) => {
        // read blob object back to json
        return {
          expires_in: response.expires_in + Math.round(+new Date() / 1000),
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        };
      })
      .catch((err) => {
        // incase of error reject promise
        return new Error(err);
      });
  }

  getTokenFromCode(code: string): Promise {
    var params = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: this.redirect_uri,
      response_mode: "form_post",
      nonce: uuidv4(),
      state: "abcd",
    };

    return this._request(params);
  }

  getTokenFromRefreshToken(refreshToken: string): Promise {
    var params = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      redirect_uri: this.redirect_uri,
      response_mode: "form_post",
      nonce: uuidv4(),
      state: "abcd",
    };

    return this._request(params);
  }
}
