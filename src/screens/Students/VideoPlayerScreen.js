import React, {PureComponent} from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

export default class VideoPlayerScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      orientation: 'portrait', // will be managed by 'react-native-responsive-screen'
    };

    // fetching navigation props
    this.embedVideoURL = this.props.navigation.getParam('embedVideoURL', null);
  }

  componentDidMount() {
    lor(this);
  }

  componentWillUnmount() {
    rol();
  }

  setWebViewRef = ref => {
    this.videoPlayer = ref;
  };

  onShouldStartLoadWithRequest = navigator => {
    if (navigator.url.indexOf('embed') !== -1) {
      return true;
    } else {
      this.videoPlayer.stopLoading();
      return false;
    }
  };

  onWebViewLoad = syntheticEvent => {
    const {nativeEvent} = syntheticEvent;
    const {loading} = nativeEvent;

    this.setState({isLoading: loading});
  };

  render() {
    const {
      state,
      embedVideoURL,
      setWebViewRef,
      onWebViewLoad,
      onShouldStartLoadWithRequest,
    } = this;

    if (!embedVideoURL) {
      return null;
    }

    const {isLoading, orientation} = state;
    // const isPortrait = orientation === 'portrait';

    // style sheet
    const styles = StyleSheet.create({
      container: {
        flex: 1,
      },
    });

    return (
      <SafeAreaView style={styles.container}>
        <WebView
          ref={setWebViewRef}
          source={{uri: embedVideoURL}}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest} // for iOS only
          onNavigationStateChange={onShouldStartLoadWithRequest}
          startInLoadingState={isLoading}
          onLoad={onWebViewLoad}
        />
      </SafeAreaView>
    );
  }
}
