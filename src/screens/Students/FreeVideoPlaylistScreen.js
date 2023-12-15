import React, {Component} from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import FreeVideoPlaylistComponent from '../../components/FreeVideoPlaylistComponent';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

export default class FreeVideoPlaylistScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      playlist: null,
      connectionState: true,
      status: null,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchPlaylist();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchPlaylist = async () => {
    try {
      // calling api
      const response = await makeRequest(BASE_URL + 'freevideos');

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {body} = response;

          this.setState({
            playlist: body,
            status: null,
            isLoading: false,
            isRefreshing: false,
          });
        } else {
          this.setState({
            status: null,
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
    <FreeVideoPlaylistComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  handleRefresh = () => {
    this.setState({isRefreshing: true}, () => {
      this.fetchPlaylist();
    });
  };
  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Free Videos" nav={this.props.navigation} />

            <FlatList
              data={this.state.playlist}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContentContainer}
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
        {/* <FooterComponent nav={this.props.navigation} tab="Free Videos" /> */}
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
