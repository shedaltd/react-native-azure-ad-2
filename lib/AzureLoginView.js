import React, {
	Component
} from 'react'
import {
	Dimensions,
	StyleSheet,
	View,
	Text
} from 'react-native'

import { WebView } from 'react-native-webview';

import AzureInstance from './AzureInstance'
import Auth from './Auth';

export default class AzureLoginView extends React.Component {
	props : {
		azureInstance: AzureInstance,
		onSuccess? : ?Function,
		onCancel? : ?Function,
	};

	state : {
		visible: bool,
	};

	constructor(props:any){
		super(props);

		this.auth = new Auth(this.props.azureInstance);
		this.state = {
			visible: true,
			cancelled: false,
		}

		this._handleTokenRequest = this._handleTokenRequest.bind(this);
		this._renderLoadingView = this._renderLoadingView.bind(this);
	}

	_handleTokenRequest(e:{ url:string }):any{
		// get code when url chage
		let code = /((\?|\&)code\=)[^\&]+/.exec(e.url);

		if( code !== null ){
			code = String(code[0]).replace(/(\?|\&)?code\=/,'');
			this.setState({visible : false})

			// request for a token
			this.auth.getTokenFromCode(code).then(token => {
				// set token to instance
				this.props.azureInstance.setToken(token);

				// call success handler
				this.props.onSuccess();
			})
				.catch((err) => {
					throw new Error(err);
				})
		}

		// if user cancels the process before finishing
		if(!this.state.cancelled && this.props.onCancel && e.url.indexOf('error=access_denied') > -1) {
			this.setState({cancelled: true, visible: false});

			// call cancel handler
			this.props.onCancel();
		}
	}

	_renderLoadingView(){
		return this.props.loadingView === undefined ? (
			<View
				style={[this.props.style, styles.loadingView,
					{
						flex:1,
						alignSelf : 'stretch',
						width : Dimensions.get('window').width,
						height : Dimensions.get('window').height
					}
				]}
			>
				<Text>{this.props.loadingMessage}</Text>
			</View>
		) : this.props.loadingView
	}

	render() {
		let js = `document.getElementsByTagName('body')[0].style.height = '${Dimensions.get('window').height}px';`

		return (
			this.state.visible ? (
				<WebView
					automaticallyAdjustContentInsets={true}
					style={[this.props.style, styles.webView, {
						flex:1,
						alignSelf : 'stretch',
						width : Dimensions.get('window').width,
						height : Dimensions.get('window').height
					}]}
					source={{uri: this.auth.getAuthUrl()}}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					decelerationRate="normal"
					javaScriptEnabledAndroid={true}
					onNavigationStateChange={this._handleTokenRequest}
					onShouldStartLoadWithRequest={(e) => {return true}}
					startInLoadingState={true}
					injectedJavaScript={js}
					scalesPageToFit={true}
				/> ) : this._renderLoadingView()
		)
	}

}

const styles = StyleSheet.create({
	webView: {
		marginTop: 50
	},
	loadingView: {
		alignItems: 'center',
		justifyContent: 'center'
	}
});
