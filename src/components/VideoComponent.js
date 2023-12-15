import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import {WebView} from 'react-native-webview';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export default class VideoComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };

    // Processing videoURL
    const {item} = this.props;
    const {videoId} = item;
    this.embedVideoURL = 'https://www.youtube.com/embed/' + videoId;
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

  handleVideoTap = () => {
    const {embedVideoURL} = this;
    this.props.nav.push('VideoPlayer', {embedVideoURL});
  };

  render() {
    const {
      state,
      setWebViewRef,
      embedVideoURL,
      onShouldStartLoadWithRequest,
      onWebViewLoad,
    } = this;
    const {isLoading} = state;

    return (
      <View style={styles.container}>
        <WebView
          ref={setWebViewRef}
          source={{uri: embedVideoURL}}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest} // for iOS only
          onNavigationStateChange={onShouldStartLoadWithRequest}
          startInLoadingState={isLoading}
          onLoad={onWebViewLoad}
        />

        <TouchableHighlight
          style={styles.transparentView}
          underlayColor="transparent"
          onPress={this.handleVideoTap}>
          <View />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: wp(61.1),
  },
  transparentView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
