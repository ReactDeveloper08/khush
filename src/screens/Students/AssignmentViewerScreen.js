import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
// Components
import {WebView} from 'react-native-webview';
import HeaderComponent from '../../components/HeaderComponent';

import ic_downloading from '../../assets/icons/ic_downloading.png';

export default class AssignmentViewerScreen extends Component {
  constructor(props) {
    super(props);

    const info = props.navigation.getParam('info', null);

    this.state = {
      fileViewURI: info,
      connectionState: true,
    };
  }

  componentDidMount = async () => {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
  };
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleDownload = () => {
    try {
      Linking.openURL(this.state.fileViewURI);
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.contactContainer}>
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title="View Document"
              nav={this.props.navigation}
              navAction="back"
            />
            <TouchableOpacity
              onPress={this.handleDownload}
              style={styles.rowStyle2}>
              <Image source={ic_downloading} style={styles.dIconStyle} />
            </TouchableOpacity>
            <Image source={{uri: this.state.fileViewURI}} style={{flex: 1}} />
          </>
        )}
        {this.state.connectionState === false && (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  contactContainer: {
    flex: 1,
    backgroundColor: '#e6e7e8',
  },
  dIconStyle: {
    height: hp(3),
    aspectRatio: 1 / 1,
    backgroundColor: '#fff',
    borderRadius: wp(2),
  },
  rowStyle2: {
    padding: wp(0.5),
    alignItems: 'center',
    position: 'absolute',
    right: 5,
    top: hp(8.5),
    zIndex: 44,
  },
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
