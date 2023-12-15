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
import HrGalleryComponent from '../../components/HrAdmin/HrGalleryComponent';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      gallaryData: null,
      connectionState: true,
      notificationCount: 0,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchGallery();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchGallery = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // calling api
      const response = await makeRequest(BASE_URL + 'getGallary', null, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {gallaryData} = response;

          this.setState({gallaryData, isLoading: false, isRefreshing: false});
        } else {
          const {message} = response;

          this.setState({
            gallaryData: null,
            status: message,
            isLoading: false,
            isRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item}) => (
    <HrGalleryComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  handleRefresh = () => {
    this.setState({isRefreshing: true}, () => {
      this.fetchGallery();
    });
  };
  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {navigation} = this.props;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Gallery" nav={navigation} />
            <FlatList
              data={this.state.gallaryData}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContentContainer}
              numColumns={2}
              refreshing={this.state.isRefreshing}
              onRefresh={this.handleRefresh}
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
    backgroundColor: '#ffffff',
  },
  listContentContainer: {
    // marginTop: heightPercentageToDP(2),
    padding: 8,
  },
  separator: {
    height: 8,
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
