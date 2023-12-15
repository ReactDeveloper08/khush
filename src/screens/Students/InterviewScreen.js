import React, {Component} from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import InterviewTileComponent from '../../components/InterviewTileComponent';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

export default class InterviewScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      interview: null,
      status: null,
      connectionState: true,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchInterview();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchInterview = async () => {
    try {
      // calling api
      const response = await makeRequest(BASE_URL + 'fetch_mocks');

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {output} = response;

          this.setState({
            interview: output,
            status: null,
            isLoading: false,
            isRefreshing: false,
          });
        } else {
          const {message} = response;
          this.setState({
            status: message,
            interview: null,
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
    <InterviewTileComponent item={item} nav={this.props.navigation} />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  handleRefresh = () => {
    this.setState({isRefreshing: true}, () => {
      this.fetchInterview();
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
            <HeaderComponent
              title="Interview Question"
              nav={this.props.navigation}
            />

            <FlatList
              data={this.state.interview}
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
        {/* <FooterComponent nav={this.props.navigation} /> */}
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
