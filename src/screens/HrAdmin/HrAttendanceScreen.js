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
import AttendanceBatchComponent from '../../components/HrAdmin/AttendanceBatchComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';
import {withNavigation} from 'react-navigation';
// Styles
import basicStyles from '../../styles/BasicStyles';
import {KEYS, getData, clearData} from '../../api/UserPreference';
import PickerModal from 'react-native-picker-modal-view';
import ModalSelector from 'react-native-modal-selector';
import showToast from '../../components/CustomToast';

export default class HrAttendanceScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isRefreshing: false,
      batchList: [],
      connectionState: true,
      branchData: [],
      selectedBranch: {
        Id: '',
        Name: 'All Branch',
        Value: 'All Branch',
      },
      facultyData: [],
      selectedFaculty: {
        key: '',
        label: 'All Faculty',
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
        Value: '',
      },
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    const {navigation} = this.props;
    // this.focusListener = navigation.addListener('didFocus', () => {
    //   // The screen is focused
    //   // Call any action
    this.fetchBatches();
    this.fetchFaculty();
    // });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchFaculty = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // calling api
      const response = await makeRequest(BASE_URL + 'getFaculty', null, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {faculty} = response;

          const facultyData = faculty.map(item => {
            const {id, name} = item;
            let data = {
              key: id,
              label: name,
            };
            console.log('data-----', data);

            return data;
          });

          this.setState({facultyData, isLoading: false});
        } else {
          const {message} = response;

          this.setState({
            facultyData: [],
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
  fetchBatches = async () => {
    const {selectedFaculty, selectedBranch} = this.state;

    try {
      const userInfo = await getData(KEYS.USER_INFO);

      const {branchId} = userInfo;

      // starting loader
      this.setState({isLoading: true});

      const params = {
        facultyId: selectedFaculty.key,
        branch_id: branchId,
        status: 'N',
      };
      console.log('###$#$', params);

      // calling api
      const response = await makeRequest(BASE_URL + 'batchList', params, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {batchList} = response;

          this.setState({batchList, isLoading: false, isRefreshing: false});
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

          // Show toast message when success is false
          showToast('No Batches Available...');

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
      <AttendanceBatchComponent
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
  handleFacultySelect = selectedFaculty => {
    this.setState({selectedFaculty}, () => {
      this.fetchBatches();
    });
  };
  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {selectedFaculty, facultyData} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title="Batch Attendance"
              nav={this.props.navigation}
            />
            <View style={styles.mainContainer}>
              {/* <Text style={styles.searchText}>Batch</Text> */}

              <View
                style={[
                  basicStyles.directionRow,
                  // basicStyles.alignCenter,
                  // basicStyles.marginLeft,
                  basicStyles.justifyEvenly,
                ]}>
                {/* <View style={styles.fromDateFieldContainer}>
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
                </View> */}
                <View style={styles.fromDateFieldContainer}>
                  {/* <PickerModal
                    items={this.state.batchTypeData}
                    requireSelection={true}
                    selected={this.state.selectedBatchType}
                    onSelected={this.handleBatchType}
                    onClosed={this.handleBatchTypeClose}
                    backButtonDisabled
                    showToTopButton={true}
                    showAlphabeticalIndex={true}
                    autoGenerateAlphabeticalIndex={false}
                    searchPlaceholderText="Search"
                    renderSelectView={this.renderBatchTypeView}
                  /> */}
                  <ModalSelector
                    data={facultyData}
                    initValue="Select Faculty"
                    cancelText="Cancel"
                    animationType="fade"
                    backdropPressToClose={true}
                    onChange={this.handleFacultySelect}
                    // style={styles.pickerStyle}
                    initValueTextStyle={styles.initialTextStyle}
                    selectTextStyle={styles.selectedTextStyle}
                    optionTextStyle={styles.optionTextStyle}>
                    <View style={[styles.customPickerStyle]}>
                      <Text
                        style={[styles.initialTextStyle, {paddingLeft: wp(2)}]}>
                        {selectedFaculty.label}
                      </Text>
                    </View>
                  </ModalSelector>
                </View>
              </View>

              <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
                <Text style={styles.textStyle}>Batches List</Text>
                {this.state.batchList && this.state.batchList.length > 0 ? (
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
                      {selectedFaculty.value && this.state.batchList === null
                        ? 'No Batches Available...'
                        : ''}
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
    width: wp(90),
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
