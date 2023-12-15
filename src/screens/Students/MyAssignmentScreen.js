import React, {Component} from 'react';
import {View, Text, FlatList, StyleSheet, Image, Alert} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import MyAssignmentsComponent from '../../components/Student/MyAssignmentsComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';
import {KEYS, getData, clearData} from '../../api/UserPreference';
// network alert
import NetInfo from '@react-native-community/netinfo';
import offline from '../../assets/icons/internetConnectionState.gif';
export default class MyAssignmentScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      connectionState: true,
      batchList: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchBatches();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchBatches = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      const {s_id} = userInfo;

      // starting loader
      this.setState({isLoading: true});

      const params = {
        sId: s_id,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'studentBatch',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {studentBatchDetails} = response;

          this.setState({
            batchList: studentBatchDetails,
            isLoading: false,
            isRefreshing: false,
          });
        } else {
          const {message} = response;

          const {isAuthTokenExpired} = response;

          if (isAuthTokenExpired === true) {
            Alert.alert(
              'Session Expired',
              'Login Again to Continue!',
              [{text: 'OK', onPress: this.handleTokenExpire}],
              {
                cancelable: false,
              },
            );
            return;
          }

          this.setState({
            batchData: null,
            status: message,
            isLoading: false,
            isRefreshing: false,
          });
        }
      } else {
        this.setState({
          batchData: null,
          isLoading: false,
          isRefreshing: false,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('LoggedOut');
  };

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <MyAssignmentsComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
        fetchBatches={this.fetchBatches}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isRefreshing: true}, () => {
        // updating list
        this.componentDidMount();
      });
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
            <HeaderComponent
              title="My Assignments"
              nav={this.props.navigation}
            />

            <View style={styles.mainContainer}>
              <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
                <Text style={styles.textStyle}>Batches List</Text>
                {this.state.batchList ? (
                  <FlatList
                    data={this.state.batchList}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={this.itemSeparator}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.notesListContent}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.handleListRefresh}
                  />
                ) : (
                  <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
                    <Text style={basicStyles.noDataTextStyle}>
                      No Batches Available...
                    </Text>
                  </View>
                )}
              </View>
            </View>
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
    backgroundColor: '#fff',
  },
  separator: {
    height: wp(2),
  },
  notesListContent: {
    padding: wp(2),
    // flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchText: {
    padding: wp(3),
    fontSize: wp(4.8),
    fontWeight: '700',
    marginBottom: wp(-4),
  },
  fromDateFieldContainer: {
    // flex: 1,
    height: hp(5),
    width: wp(70),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    fontSize: wp(3),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: wp(3),
    justifyContent: 'center',
  },
  searchButton: {
    backgroundColor: '#1d99d2',
    width: wp(20),
    alignSelf: 'center',
    marginTop: hp(2),
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(1),
  },
  textStyle: {
    padding: wp(3),
    fontSize: wp(4.8),
    fontWeight: '700',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp(4),
  },
});
