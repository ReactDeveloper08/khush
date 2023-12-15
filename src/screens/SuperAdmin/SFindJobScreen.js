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
// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import ProcessingLoader from '../../components/ProcessingLoader';
import SJobTileComponent from '../../components/SuperAdmin/SJobTileComponent';

export default class SFindJobScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isProcessing: false,
      jobDetail: null,
      connectionState: true,
      isListRefreshing: false,
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
      // calling api
      const response = await makeRequest(BASE_URL + 'fetch_latest_placement');

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {output} = response;

          this.setState({
            jobDetail: output,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          this.setState({
            isLoading: false,
            isListRefreshing: false,
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
    <SJobTileComponent
      item={item}
      toggleProcessingLoader={this.toggleProcessingLoader}
      nav={this.props.navigation}
    />
  );

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      await this.fetchJobs();
    } catch (error) {
      console.log(error.message);
    }
  };
  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Jobs Posted" nav={this.props.navigation} />

            <FlatList
              data={this.state.jobDetail}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.notesListContent}
              refreshing={this.state.isListRefreshing}
              onRefresh={this.handleListRefresh}
            />
          </>
        )}
        {this.state.connectionState === false && (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        )}
        {/* <FooterComponent nav={this.props.navigation} tab="Find Job" /> */}
        {this.state.isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
