/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
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
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import RegistrationInfoComponent from '../../components/SuperAdmin/RegistrationInfoComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';
import {KEYS, getData, clearData} from '../../api/UserPreference';
import showToast from '../../components/CustomToast';

export default class HrAdmissionScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalRegistration: 0,
      registrationList: null,
      connectionState: true,
      branchData: [],
      selectedBranch: {
        Id: 0,
        Name: 'All Branch',
        Value: 'All Branch',
      },

      isLoading: true,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchRegistration();
    // this.fetchBranches();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('LoggedOut');
  };

  fetchRegistration = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      const {branchId} = userInfo;

      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        branchId: branchId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'getRegistrationList',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {studentRegister, totalRegistration} = response;

          this.setState({
            registrationList: studentRegister,
            totalRegistration,
            status: null,
            isLoading: false,
            isRefreshing: false,
          });

          // resetting notification count
          // await this.resetNotificationCount(params);
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
            status: message,
            registrationList: null,
            isLoading: false,
            isRefreshing: false,
          });
        }
        // }
      } else {
        this.setState({
          registrationList: null,
          isLoading: false,
          isRefreshing: false,
        });

        showToast('Network Request Error');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderBranchView = (disabled, selected, showModal) => {
    const {selectedBranch} = this.state;
    const {Name} = selectedBranch;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'All Branch') {
      labelStyle.color = '#666';
    }

    const handlePress = disabled ? null : showModal;

    return (
      <View style={[styles.inputContainer]}>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          <Text style={labelStyle}>{Name}</Text>
          {/* <Image source={ic_down} resizeMode="cover" style={styles.downIcon} /> */}
        </TouchableOpacity>
      </View>
    );
  };

  // handleSelectedBranch = selectedBranch => {
  //   this.setState({selectedBranch}, () => {
  //     this.fetchRegistration();
  //   });
  //   return selectedBranch;
  // };

  handleSelectedBranchClose = () => {
    const {selectedBranch} = this.state;
    this.setState({selectedBranch});
  };

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <RegistrationInfoComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
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

    const {totalRegistration, registrationList, isRefreshing} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Registration" nav={this.props.navigation} />
            <View style={styles.mainContainer}>
              {/* <Text style={styles.searchText}>Branch</Text> */}

              {/* <View
            style={[
              basicStyles.directionRow,
              basicStyles.alignCenter,
              // basicStyles.marginLeft,
              basicStyles.justifyEvenly,
            ]}>
            <View style={styles.fromDateFieldContainer}>
              <PickerModal
                items={this.state.branchData}
                requireSelection={true}
                selected={this.state.selectedBranch}
                onSelected={this.handleSelectedBranch}
                onClosed={this.handleSelectedBranchClose}
                backButtonDisabled
                showToTopButton={true}
                showAlphabeticalIndex={true}
                autoGenerateAlphabeticalIndex={false}
                searchPlaceholderText="Search"
                renderSelectView={this.renderBranchView}
              />
            </View>
          </View> */}

              <View
                style={[
                  basicStyles.alignCenter,
                  basicStyles.directionRow,
                  {
                    backgroundColor:
                      '#' +
                      (0x1000000 + Math.random() * 0xffffff)
                        .toString(16)
                        .substr(1, 6) +
                      55,
                    marginHorizontal: wp(2),
                    paddingHorizontal: wp(2),
                    marginTop: wp(2),
                    paddingVertical: wp(1.5),
                    borderRadius: wp(1.2),
                  },
                ]}>
                <Text
                  style={[
                    basicStyles.text,
                    {color: '#222', fontSize: wp(4), fontWeight: '700'},
                  ]}>
                  Total Registration :
                </Text>
                <Text
                  style={[
                    basicStyles.text,
                    {color: '#222', fontSize: wp(4), fontWeight: '700'},
                  ]}>
                  {' '}
                  {totalRegistration}
                </Text>
              </View>

              {registrationList ? (
                <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
                  <Text style={styles.textStyle}>Registration List</Text>
                  <FlatList
                    data={registrationList}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={this.itemSeparator}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.notesListContent}
                    refreshing={isRefreshing}
                    onRefresh={this.handleListRefresh}
                  />
                </View>
              ) : (
                <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
                  <Text style={basicStyles.noDataTextStyle}>
                    No Data Available
                  </Text>
                </View>
              )}
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
    // marginTop: wp(1),
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
    width: wp(60),
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
    fontSize: wp(4.5),
    fontWeight: '700',
    color: '#333',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp(4),
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
