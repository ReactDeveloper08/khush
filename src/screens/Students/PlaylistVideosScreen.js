import React, {Component} from 'react';
import {View, StyleSheet, FlatList, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
// Components
import CustomLoader from '../../components/CustomLoader';
import VideoComponent from '../../components/VideoComponent';
import HeaderComponent from '../../components/HeaderComponent';

// API
import {makeRequest} from '../../api/ApiInfo';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';

export default class PlaylistVideosScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      videoList: null,
      status: null,
      connectionState: true,
    };

    // fetching navigation params
    this.categoryName = this.props.navigation.getParam('categoryName', null);
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchVideoList();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchVideoList = async () => {
    try {
      // fetching navigation params
      const playlistId = this.props.navigation.getParam('playlistId', null);

      if (playlistId) {
        const API_KEY = 'AIzaSyCCv_L6QUIvaAARb2D4Nu33nS80N5cUjuw';

        const url =
          'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=' +
          playlistId +
          '&key=' +
          API_KEY;

        // calling api
        const response = await makeRequest(url, null, false);

        // processing response
        if (response) {
          const {items} = response;

          if (Array.isArray(items) && items.length > 0) {
            const videoList = items.map(item => {
              const {snippet} = item;
              const {resourceId} = snippet;
              const {videoId} = resourceId;

              return {videoId};
            });

            this.setState({
              videoList,
              status: null,
              isLoading: false,
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => (
    <VideoComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {videoList} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title={this.categoryName}
              navAction="back"
              nav={this.props.navigation}
            />
            <FlatList
              data={videoList}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContentContainer}
            />
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
    backgroundColor: '#ececec',
  },
  separator: {
    height: wp(2),
  },
  listContentContainer: {
    padding: wp(2),
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
