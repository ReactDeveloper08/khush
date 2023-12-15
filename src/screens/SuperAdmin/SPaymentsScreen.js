/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
// Components
import HeaderComponent from '../../components/HeaderComponent';
import PaymentsListComponent from '../../components/SuperAdmin/PaymentsListComponent';
import SOtpPopUp from '../../components/SuperAdmin/SPopUpComponent/SOtpPopUp';
import CustomLoader from '../../components/CustomLoader';
import ProcessingLoader from '../../components/ProcessingLoader';
import ModalSelector from 'react-native-modal-selector';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../../api/UserPreference';
import basicStyles from '../../styles/BasicStyles';

// Icons
import ic_add_plus from '../../assets/icons/ic_add_plus.png';
import showToast from '../../components/CustomToast';

export default class SPaymentsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTemplatePop: false,
      isLoading: true,
      isProcessing: false,
      paymentList: null,
      connectionState: true,
      payModes: [],
      selectedModes: {
        key: '',
        label: 'Select Mode',
      },

      branchData: [],
      selectedBranch: {
        key: '',
        label: 'All Branch',
      },

      statusData: [],
      selectedStatus: {
        Id: '',
        Name: 'Select Status',
        Value: 'Select Status',
      },

      message: '',
      title: '',
      showImagePopup: false,
      status: 'No Notification to show ...',
      isRefreshing: false,
      fromDate: '',
      fromDateText: 'From Date',
      toDate: '',
      toDateText: 'To Date',
      isFromVisible: false,
      isToVisible: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchPayments();
    this.fetchBranches();
    this.fetchModes();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchModes = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // calling api
      const response = await makeRequest(BASE_URL + 'paymentModes', null, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {modes} = response;

          const payModes = modes.map(item => {
            const {mode} = item;
            let data = {
              key: mode,
              label: mode,
            };

            return data;
          });

          this.setState({payModes, isLoading: false});
        } else {
          const {message} = response;

          this.setState({
            branchData: [],
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

  fetchBranches = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // calling api
      const response = await makeRequest(BASE_URL + 'getBranch', null, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {branch} = response;

          const branchData = branch.map(item => {
            const {id, name} = item;
            let data = {
              key: id,
              label: name,
            };

            return data;
          });

          this.setState({branchData, isLoading: false});
        } else {
          const {message} = response;

          this.setState({
            branchData: [],
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

  fetchPayments = async () => {
    const {selectedBranch, fromDate, toDate, selectedModes} = this.state;
    try {
      // starting loader
      this.setState({isLoading: true});

      const params = {
        mode: selectedModes.key,
        branchId: selectedBranch.key,
        fromDate: fromDate,
        toDate: toDate,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'paymentSummary',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {payentList} = response;
          this.setState({
            paymentList: payentList,
            status: null,
            isLoading: false,
          });

          // resetting notification count
          // await this.resetNotificationCount(params);
        } else {
          const {message} = response;

          this.setState({
            status: message,
            paymentList: null,
            isLoading: false,
            isRefreshing: false,
          });
        }
        // }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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

  handleModeSelect = selectedModes => {
    this.setState({selectedModes}, () => {
      this.fetchPayments();
    });
  };

  handleBranchSelect = selectedBranch => {
    this.setState({selectedBranch}, () => {
      this.fetchPayments();
    });
  };

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <PaymentsListComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
        handleApprovePayment={this.handleApprovePayment}
      />
    );
  };
  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  showPicker1 = () => {
    this.setState({
      isFromVisible: true,
    });
  };
  showPicker2 = () => {
    this.setState({
      isToVisible: true,
    });
  };

  hidePicker = () => {
    this.setState({
      isFromVisible: false,
      isToVisible: false,
    });
  };

  handleFromPicker = dateObj => {
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const selectedDate = `${date}-${month}-${year}`;

    this.setState(
      {
        fromDate: selectedDate,
        fromDateText: selectedDate,
        isFromVisible: false,
      },
      () => {
        this.fetchPayments();
      },
    );
  };

  handleToConfirm = dateObj => {
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const selectedDate = `${date}-${month}-${year}`;

    this.setState(
      {toDate: selectedDate, toDateText: selectedDate, isToVisible: false},
      () => {
        this.fetchPayments();
      },
    );
  };

  handleApprovePayment = async data => {
    try {
      // starting loader
      this.setState({isProcessing: true});

      const params = {
        id: data.id,
        otp: '',
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'paymentApproval',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success, message} = response;

        if (success) {
          this.popData = data;

          this.setState({
            isProcessing: false,
            showOtpPop: true,
            isLoading: false,
          });
          showToast(message);
        } else {
          this.setState({
            isProcessing: false,
            isLoading: false,
            isRefreshing: false,
          });
          showToast(message);
        }
        // }
      } else {
        this.setState({
          isProcessing: false,
          isLoading: false,
          isRefreshing: false,
        });
        showToast('Network Request Error!');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  closePopup = () => {
    this.setState({showOtpPop: false});
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {
      paymentList,
      isProcessing,
      status,
      isRefreshing,
      isFromVisible,
      isToVisible,
      fromDateText,
      toDateText,
      branchData,
      selectedBranch,
      payModes,
      selectedModes,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <View style={styles.headerContainer}>
              <HeaderComponent title="Payments" nav={this.props.navigation} />
            </View>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.marginTopHalf,
                basicStyles.justifyEvenly,
              ]}>
              <ModalSelector
                data={payModes}
                initValue="Select Mode"
                cancelText="Cancel"
                animationType="fade"
                backdropPressToClose={true}
                onChange={this.handleModeSelect}
                // style={styles.pickerStyle}
                initValueTextStyle={styles.initialTextStyle}
                selectTextStyle={styles.selectedTextStyle}
                optionTextStyle={styles.optionTextStyle}>
                <View style={[styles.customPickerStyle]}>
                  <Text style={[styles.initialTextStyle, {paddingLeft: wp(2)}]}>
                    {selectedModes.label}
                  </Text>
                </View>
              </ModalSelector>

              <ModalSelector
                data={branchData}
                initValue="Select Branch"
                cancelText="Cancel"
                animationType="fade"
                backdropPressToClose={true}
                onChange={this.handleBranchSelect}
                // style={styles.pickerStyle}
                initValueTextStyle={styles.initialTextStyle}
                selectTextStyle={styles.selectedTextStyle}
                optionTextStyle={styles.optionTextStyle}>
                <View
                  style={[styles.customPickerStyle, {marginLeft: wp(-1.2)}]}>
                  <Text style={[styles.initialTextStyle, {paddingLeft: wp(2)}]}>
                    {selectedBranch.label}
                  </Text>
                </View>
              </ModalSelector>
            </View>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,

                basicStyles.justifyEvenly,
              ]}>
              <View style={[styles.fromDateFieldContainer, {width: wp(40)}]}>
                <TouchableOpacity
                  underlayColor="transparent"
                  onPress={this.showPicker1}>
                  <View style={styles.dateButtonContainer}>
                    <Text style={styles.initialTextStyle}>{fromDateText}</Text>
                  </View>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isFromVisible}
                  mode="date"
                  maximumDate={new Date()}
                  onConfirm={this.handleFromPicker}
                  onCancel={this.hidePicker}
                />
              </View>

              <View style={[styles.fromDateFieldContainer, {width: wp(40)}]}>
                <TouchableOpacity
                  underlayColor="transparent"
                  onPress={this.showPicker2}>
                  <View style={styles.dateButtonContainer}>
                    <Text style={styles.initialTextStyle}>{toDateText}</Text>
                  </View>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isToVisible}
                  mode="date"
                  maximumDate={new Date()}
                  onConfirm={this.handleToConfirm}
                  onCancel={this.hidePicker}
                />
              </View>
            </View>

            <View style={[basicStyles.marginBottom, basicStyles.flexOne]}>
              <Text style={styles.textStyle}>Payments List</Text>
              {paymentList ? (
                <FlatList
                  data={paymentList}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  ItemSeparatorComponent={this.itemSeparator}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContentContainer}
                  refreshing={isRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              ) : (
                <View style={styles.messageContainer}>
                  <Text style={styles.messageText}>{status}</Text>
                </View>
              )}
            </View>

            {this.state.showOtpPop && (
              <SOtpPopUp
                closePopup={this.closePopup}
                nav={this.props.navigation}
                data={this.popData}
                fetchPayments={this.fetchPayments}
              />
            )}
          </>
        )}
        {this.state.connectionState === false && (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        )}
        {isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#096481',
  },
  listContentContainer: {
    padding: wp(2),
  },
  separator: {
    height: wp(2),
  },
  messageContainer: {
    flex: 1,
    padding: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRow: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
  addButtonStyles2: {
    marginLeft: wp(-4),
  },
  messageText: {
    color: '#777',
    fontWeight: '700',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
  fromDateFieldContainer: {
    height: hp(5),
    width: wp(40),
    paddingHorizontal: wp(2),
    borderRadius: 5,
    fontSize: wp(3),
    color: '#333',
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: wp(3),
    justifyContent: 'center',
  },
  loginFormTextInput: {
    height: hp(5),
    width: wp(85),
    fontSize: wp(3),
    borderWidth: 0.8,
    borderColor: '#999',
    textAlignVertical: 'top',
    borderRadius: wp(1),
    paddingLeft: wp(2),
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
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp(3.2),
  },
  textStyle: {
    padding: wp(2),
    fontSize: wp(4.8),
    fontWeight: '700',
    marginTop: wp(5),
  },
  loginFormTextArea: {
    height: hp(10),
    width: wp(62),
    fontSize: wp(3),
    marginRight: wp(5),
    borderWidth: 0.8,
    borderColor: '#999',
    textAlignVertical: 'top',
    borderRadius: wp(1),
    paddingLeft: wp(2),
  },

  // Picker Style

  customPickerStyle: {
    width: wp(40),
    height: wp(10),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: wp(1),
    justifyContent: 'center',
    // borderRadius: 1,
    margin: wp(2),
    alignSelf: 'center',
  },
  pickerStyle: {
    width: wp(40),
    // height: wp(12),
    margin: wp(2),
  },

  templatePickerStyle: {
    width: wp(35),
    // borderRadius: 1,
    margin: wp(2),
  },

  initialTextStyle: {
    color: '#666',
    fontSize: wp(3),
    // marginLeft: wp(2),
    marginVertical: wp(1.33),
    textAlign: 'left',
  },

  optionTextStyle: {
    color: '#111',
  },

  selectedTextStyle: {
    textAlign: 'left',
    color: '#111',
    fontSize: wp(3),
    // marginLeft: wp(2),
    marginVertical: wp(1.33),
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
