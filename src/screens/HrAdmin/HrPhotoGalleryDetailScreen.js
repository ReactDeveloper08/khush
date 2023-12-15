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
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import GalleryDetailComponent from '../../components/GalleryDetailComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ImagePopUpComponent from '../../components/ImagePopUpComponent';

import Gallery from 'react-native-image-gallery';

import ic_close from '../../assets/icons/ic_close.png';

export default class PhotoGalleryDetailScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      showImagePopup: false,
      albumData: [{source: {uri: 'https://i.imgur.com/XP2BE7q.jpg'}}],

      notificationCount: 0,
    };
  }

  componentDidMount() {
    this.dataModule();
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

  renderItem = ({item}) => (
    <GalleryDetailComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleGoBack = () => {
    this.props.navigation.pop();
  };

  render() {
    const {albumData, blogs} = this.state;
    const {navigation} = this.props;

    return (
      <SafeAreaView style={styles.container}>
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
    top: hp(12),
  },
  closeButton: {
    height: hp(4),
    aspectRatio: 1 / 1,
  },
});
