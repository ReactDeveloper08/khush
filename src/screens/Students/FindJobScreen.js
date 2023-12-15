import React, {Component} from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import ProcessingLoader from '../../components/ProcessingLoader';
import FindJobTileComponent from '../../components/FindJobTileComponent';
// network alert
import NetInfo from '@react-native-community/netinfo';
import offline from '../../assets/icons/internetConnectionState.gif';
import {KEYS, getData} from '../../api/UserPreference';
export default class FindJobScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      isProcessing: false,
      connectionState: true,
      jobDetail: null,
      is_applicable: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchJobs();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchJobs = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const {id: userId} = userInfo;

      // calling api
      const params = {user_id: userId};
      const response = await makeRequest(
        BASE_URL + 'fetch_latest_placement',
        params,
      );
      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {output, is_applicable} = response;
          console.log('khuh', response);
          this.setState({
            jobDetail: output,
            is_applicable,
            isLoading: false,
            isRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  toggleProcessingLoader = isProcessing => {
    this.setState({isProcessing});
  };

  renderItem = ({item}) => (
    <FindJobTileComponent
      item={item}
      toggleProcessingLoader={this.toggleProcessingLoader}
      nav={this.props.navigation}
      is_applicable={this.state.is_applicable}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  handleRefresh = () => {
    this.setState({isRefreshing: true}, () => {
      this.fetchJobs();
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
            <HeaderComponent title="Find Job" nav={this.props.navigation} />

            <FlatList
              data={this.state.jobDetail}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.notesListContent}
              refreshing={this.state.isRefreshing}
              onRefresh={this.handleRefresh}
            />

            {/* <FooterComponent nav={this.props.navigation} tab="Find Job" /> */}
          </>
        )}
        {this.state.connectionState === false && (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        )}
        {this.state.isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#e6e7e8',
  },
  separator: {
    height: wp(2),
  },
  notesListContent: {
    padding: wp(2),
  },
});
