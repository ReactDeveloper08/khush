/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableHighlight,
  Alert,
  ScrollView,
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
import showToast from '../../components/CustomToast';
import HeaderComponent from '../../components/HeaderComponent';

import SAttendanceDateComponent from '../../components/SuperAdmin/SAttendanceDateComponent';
import PickerModal from 'react-native-picker-modal-view';
import ModalSelector from 'react-native-modal-selector';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';

export default class SAttendanceSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isRefreshing: false,
      batchList: null,
      connectionState: true,
      branchData: [],
      selectedBranch: {
        key: '',
        label: 'All Branch',
      },

      attendanceSummary: [],
      status: null,

      selectedSlot: {},
      selectedSlotIndex: 0,
      selectedTimeSlotId: -1,
      selectedDate: '',

      batchCount: 0,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchAttendanceSummary();
    this.fetchBranches();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
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

  fetchAttendanceSummary = async () => {
    const {selectedBranch} = this.state;
    try {
      // starting loader
      this.setState({isLoading: true});

      const params = {
        branchId: selectedBranch.key,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'attendanceSummary',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {attendanceSummary} = response;

          const [selectedSlot] = attendanceSummary;
          console.log('====================================');
          console.log('###', selectedSlot);
          console.log('====================================');

          // const [selectedSlot] = attendanceSummary;

          this.setState({
            attendanceSummary,
            selectedDate: selectedSlot.alias,
            selectedSlot,
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

  handleSelectSlotDate = (selectedSlot, selectedSlotIndex) => () => {
    const {alias} = selectedSlot;
    this.setState({selectedSlot, selectedSlotIndex, selectedDate: alias});
  };

  renderSlots = () => {
    const {attendanceSummary, selectedSlotIndex} = this.state;

    return attendanceSummary.map((slot, index) => {
      const {date, alias} = slot;

      let slotContainerStyle = [styles.dayTab];
      let slotDayStyle = [styles.day];
      let slotSubHeadingStyle = [styles.subHeading];
      if (selectedSlotIndex === index) {
        slotContainerStyle.push(styles.active);
        slotDayStyle.push(styles.activeText);
        slotSubHeadingStyle.push(styles.activeText);
      }

      return (
        <TouchableHighlight
          onPress={this.handleSelectSlotDate(slot, index)}
          underlayColor="transparent"
          style={slotContainerStyle}
          key={index}>
          <View>
            <Text style={slotDayStyle}>{date}</Text>
            {/* <Text style={slotSubHeadingStyle}>{alias}</Text> */}
          </View>
        </TouchableHighlight>
      );
    });
  };

  renderItem2 = ({item, index}) => {
    const {alias} = this.state.selectedSlot; // Get the alias from selectedSlot

    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <SAttendanceDateComponent
        item={item}
        selectTimeSlotCallback={this.selectTimeSlotCallback}
        index={index + 1}
        backgroundColor={backgroundColor}
        nav={this.props.navigation}
        date={alias} // Pass the "alias" from selectedSlot to HrAttendanceDateComponent
      />
    );
  };

  handleBranchSelect = selectedBranch => {
    this.setState({selectedBranch}, () => {
      this.fetchAttendanceSummary();
    });
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

    const {
      status,
      selectedSlot,
      isLoading,
      couponCode,
      couponText,
      selectedDate,
    } = this.state;
    const {batchCount, branchData, selectedBranch} = this.state;

    const {batchInfo} = selectedSlot || {};

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title="Attendance Summary"
              nav={this.props.navigation}
            />

            <View style={styles.mainContainer}>
              <Text style={styles.searchText}>Date</Text>

              <View style={[styles.deliverySlotsDayContainer]}>
                {this.renderSlots()}
              </View>

              <View style={[basicStyles.marginBottom, basicStyles.flexOne]}>
                <View
                  style={[
                    basicStyles.directionRow,
                    basicStyles.alignCenter,

                    basicStyles.justifyEvenly,
                  ]}>
                  {/* <View style={styles.dateFieldStyles}>
                    <Text style={styles.initialTextStyle}>{selectedDate}</Text>
                  </View> */}
                  <ModalSelector
                    data={branchData}
                    initValue="Select Branch"
                    cancelText="Cancel"
                    animationType="fade"
                    backdropPressToClose={true}
                    onChange={this.handleBranchSelect}
                    initValueTextStyle={styles.initialTextStyle}
                    selectTextStyle={styles.selectedTextStyle}
                    optionTextStyle={styles.optionTextStyle}>
                    <View style={[styles.customPickerStyle]}>
                      <Text
                        style={[styles.initialTextStyle, {paddingLeft: wp(2)}]}>
                        {selectedBranch.label}
                      </Text>
                    </View>
                  </ModalSelector>
                </View>

                <View style={[styles.infoContainer]}>
                  <Text style={[styles.serialText]}>Sr</Text>
                  <Text
                    style={[styles.midText2, {flex: 1.5, textAlign: 'left'}]}>
                    Batch
                  </Text>
                  <Text
                    style={[styles.midText2, {flex: 0.8, textAlign: 'center'}]}>
                    Branch
                  </Text>
                  <Text
                    style={[styles.midText2, {flex: 0.8, textAlign: 'center'}]}>
                    Absent
                  </Text>
                </View>

                <View style={basicStyles.flexOne}>
                  <FlatList
                    data={batchInfo}
                    renderItem={this.renderItem2}
                    keyExtractor={this.keyExtractor}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.itemSeparator}
                    contentContainerStyle={styles.listContainer}
                  />
                </View>
              </View>

              {/* {this.state.batchList ? (
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
            </View>
          ) : (
            <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
              <Text style={basicStyles.noDataTextStyle}>No Batches</Text>
            </View>
          )} */}
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
  dateFieldStyles: {
    marginVertical: wp(4),
    flexDirection: 'row',
    width: wp(40),
    height: wp(8),
    borderWidth: 0.8,
    borderColor: '#999',
    borderRadius: wp(1),
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // borderRadius: 1,
    margin: wp(2),
    // marginTop: wp(3),
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
  // Picker Style
  customPickerStyle: {
    width: wp(40),
    height: wp(8),
    borderWidth: 0.8,
    borderColor: '#999',
    borderRadius: wp(1),
    justifyContent: 'center',
    // borderRadius: 1,
    margin: wp(2),
    // marginTop: wp(3),
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
    textAlign: 'center',
  },

  optionTextStyle: {
    color: '#111',
  },

  selectedTextStyle: {
    textAlign: 'left',
    color: '#111',
    fontSize: wp(3),
    marginLeft: wp(2),
    marginVertical: wp(1.33),
  },

  // Slots
  deliverySlotsContainer: {
    flex: 1,
  },
  day: {
    //fontWeight: '700',
    fontSize: wp(2.5),
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingHorizontal: wp(0),
  },
  day1: {
    //fontWeight: '700',
    fontSize: wp(2.8),
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingHorizontal: wp(2),
  },
  subHeading: {
    fontWeight: '700',
    fontSize: wp(2),
    textAlign: 'center',
  },
  dayTab: {
    borderWidth: 0.5,
    borderColor: '#333',
    // backgroundColor: '#fff',
    padding: wp(1.8),
    marginRight: wp(1),
    // borderRadius: wp(2),
    flex: 1,
  },
  deliverySlotsDayContainer: {
    flexDirection: 'row',
    // marginRight: wp(2),
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
    marginTop: wp(5),
    //marginRight: wp(),
  },
  active: {
    backgroundColor: '#1d99d2',
    borderBottomWidth: 0,
    // borderBottomColor: '#1d99d2',
  },
  dateContainer: {
    height: hp(5.5),
    width: wp(40.2),
    marginHorizontal: wp(1),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginVertical: hp(1.5),
    borderColor: '#ccc',
    borderRadius: wp(3),
  },
  activeText: {
    color: '#fff',
  },

  serialText: {
    // flex: 1,
    width: wp(10),
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: '700',
    // borderWidth: 1,
    textAlign: 'left',
    // marginLeft: wp(3),
  },
  midText2: {
    flex: 1,

    color: '#333',
    fontWeight: '700',
    fontSize: wp(3.2),
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: wp(0.5),
    justifyContent: 'space-between',
    backgroundColor: '#888',
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
