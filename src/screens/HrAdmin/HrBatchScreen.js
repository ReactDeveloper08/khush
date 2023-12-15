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
import HrBatchInfoComponent from '../../components/HrAdmin/HrBatchInfoComponent';

//Navigation
import {withNavigation} from 'react-navigation';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';
import {KEYS, getData, clearData} from '../../api/UserPreference';
import showToast from '../../components/CustomToast';

export default class SFeesScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      batchList: null,
      connectionState: true,
      branchData: [],
      selectedBranch: {
        Id: '',
        Name: 'All Branch',
        Value: 'All Branch',
      },

      batchTypeData: [
        {
          Id: '',
          Name: 'All',
          Value: '',
        },
        {
          Id: 1,
          Name: 'Running',
          Value: 'N',
        },
        {
          Id: 2,
          Name: 'Completed',
          Value: 'Y',
        },
      ],
      selectedBatchType: {
        Id: '',
        Name: 'Select Batch Type',
        Value: 'N',
      },
      batchCount: 0,
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
    const {selectedBatchType} = this.state;
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      const {branchId} = userInfo;

      // starting loader
      this.setState({isLoading: true});

      const params = {
        branch_id: branchId,
        status: selectedBatchType.Value,
      };

      // calling api
      const response = await makeRequest(BASE_URL + 'batchList', params, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {batchList} = response;

          let batchCount = 0;

          if (batchList.length > 0) {
            batchCount = batchList.length;
          }

          this.setState({
            batchList,
            batchCount,
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
            batchData: [],
            status: message,
            isLoading: false,
            isRefreshing: false,
          });
        }
      } else {
        this.setState({
          batchData: [],
          isLoading: false,
          isRefreshing: false,
        });

        showToast('Network Request Error!');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('LoggedOut');
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

  handleSelectedBranch = selectedBranch => {
    this.setState({selectedBranch}, () => {
      this.fetchBatches();
    });
    return selectedBranch;
  };

  handleSelectedBranchClose = () => {
    const {selectedBranch} = this.state;
    this.setState({selectedBranch});
  };

  renderBatchTypeView = (disabled, selected, showModal) => {
    const {selectedBatchType} = this.state;
    const {Name} = selectedBatchType;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'Select Batch Type') {
      labelStyle.color = '#777';
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

  handleBatchType = selectedBatchType => {
    this.setState({selectedBatchType}, () => {
      this.fetchBatches();
    });
    return selectedBatchType;
  };

  handleBatchTypeClose = () => {
    const {selectedBatchType} = this.state;
    this.setState({selectedBatchType});
  };

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <HrBatchInfoComponent
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
        this.fetchBatches();
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {isRefreshing} = this.state;
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {batchCount} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Batch" nav={this.props.navigation} />
            <View style={styles.mainContainer}>
              <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.justifyBetween,
                    basicStyles.alignCenter,
                  ]}>
                  <Text style={styles.textStyle}>Batches List</Text>
                  <Text style={[styles.textStyle, {fontSize: wp(4.0)}]}>
                    Total : {batchCount}
                  </Text>
                </View>

                {this.state.batchList ? (
                  <FlatList
                    data={this.state.batchList}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={this.itemSeparator}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.notesListContent}
                    refreshing={isRefreshing}
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
    width: wp(40),
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
