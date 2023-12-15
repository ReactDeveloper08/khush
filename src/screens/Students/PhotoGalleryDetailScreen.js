import React, {Component} from 'react';
import {
  View,
  Image,
  Linking,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  AppState,
} from 'react-native';

// Components
import SafeAreaView from 'react-native-safe-area-view';
// import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
// import GalleryDetailComponent from '../../components/GalleryDetailComponent';

// API
// import {makeRequest, BASE_URL} from '../../api/ApiInfo';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';

import Gallery from 'react-native-image-gallery';

import ic_close from '../../assets/icons/ic_close.png';

export default class PhotoGalleryDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      showImagePopup: false,
      connectionState: true,
      albumData: [{source: {uri: 'https://i.imgur.com/XP2BE7q.jpg'}}],

      notificationCount: 0,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.dataModule();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  dataModule = async () => {
    let galleryImages = this.props.navigation.getParam('galleryImages', null);

    let galleryImagesData = galleryImages.map(item => {
      let data = {
        source: {uri: item},
      };

      return data;
    });

    this.setState({albumData: galleryImagesData});
  };

  handleGoBack = () => {
    this.props.navigation.pop();
  };

  render() {
    const {albumData, blogs} = this.state;
    const {navigation} = this.props;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title="Gallery Detail"
              nav={navigation}
              navAction="back"
            />
            <Gallery
              images={albumData}
              // initialPage={imageIndex}
              pageMargin={20}
              style={styles.galleryViewer}
            />
            <TouchableHighlight
              style={styles.closeButtonContainer}
              underlayColor="transplant"
              onPress={this.handleGoBack}>
              <Image
                source={require('../../assets/icons/close.png')}
                resizeMode="cover"
                style={styles.closeButton}
              />
            </TouchableHighlight>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContentContainer: {
    marginTop: hp(1),
    padding: 8,
  },
  separator: {
    height: hp(2),
  },
  galleryViewer: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButtonContainer: {
    position: 'absolute',
    right: wp(4),
    top: hp(9),
  },
  closeButton: {
    height: hp(4),
    aspectRatio: 1 / 1,
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
