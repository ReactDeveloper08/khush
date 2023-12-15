/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import HrBatchDetailComponent from '../../components/HrAdmin/HrBatchDetailComponent';
//Navigation
import {withNavigation} from 'react-navigation';
// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';
import SAssignmentPopUp from '../../components/SuperAdmin/SPopUpComponent/SAssignmentPopUp';
import {clearData} from '../../api/UserPreference';

export default class SBatchDetailScreen extends Component {
  constructor(props) {
    super(props);

    const batchInfo = props.navigation.getParam('batchInfo', null);

    this.state = {
      studentDetails: null,

      batchDetails: batchInfo,
      assignmentData: null,

      showAssignPop: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchBatchDetail();
  }
  componentWillUnmount() {}
  fetchBatchDetail = async () => {
    const batchInfo = await this.props.navigation.getParam('batchInfo', null);

    try {
      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        b_id: batchInfo.batchId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'batchDetails',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {batchDetails, studentDetails, studentAssignment} = response;

          this.setState({
            batchDetails,
            studentDetails,
            assignmentData: studentAssignment,
            status: null,
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
            status: message,
            assignmentData: null,
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

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('LoggedOut');
  };

  renderAssignments = ({item}) => {
    const {id, givesOn, submitted, notSubmitted} = item;

    return (
      <TouchableOpacity
        style={[styles.container, {backgroundColor: 'transparent'}]}
        onPress={this.handleShowAssignPop(item)}>
        <View
          style={[
            styles.mainContainer2,
            // basicStyles.paddingHalfHorizontal,
            basicStyles.justifyBetween,
          ]}>
          <Text style={styles.serialText}>{id}</Text>
          <Text style={[styles.midText2, {paddingLeft: wp(4)}]}>{givesOn}</Text>
          <Text style={styles.midText2}>{submitted}</Text>
          <Text style={[styles.midText2]}>{notSubmitted}</Text>
          {/* <Text style={styles.subTitle2}>{payDate}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <HrBatchDetailComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleShowAssignPop = data => () => {
    this.setState({showAssignPop: true});
    this.popData = data;
  };

  closePopup = () => {
    this.setState({showAssignPop: false});
  };

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {batchDetails, assignmentData} = this.state;

    const {
      batchId,
      branchId,
      courseName,
      startedOn,
      endOn,
      batchTime,
      branchName,
      batchType,
      batchStatus,
      batchCode,
      facultyName,
    } = batchDetails;
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title="Batch Detail"
          nav={this.props.navigation}
          navAction="back"
        />

        <View style={styles.contentContainer}>
          <View style={styles.rowStyle}>
            <Text style={styles.nameStyle}>{courseName} </Text>
            <Text
              style={[basicStyles.text, basicStyles.textBold, {color: '#111'}]}>
              ({branchName})
            </Text>
          </View>

          <View style={[styles.rowStyle, basicStyles.justifyBetween]}>
            <View style={[styles.rowStyle, basicStyles.flexOne]}>
              <Text style={styles.headText}>Batch Code</Text>
              <Text style={styles.midText}> - </Text>
              <Text style={[styles.subTitle, basicStyles.flexOne]}>
                {batchCode}
              </Text>
            </View>
            <View style={[styles.rowStyle, basicStyles.flexOne]}>
              <Text style={styles.headText}>Faculty</Text>
              <Text style={styles.midText}> - </Text>
              <Text style={styles.subTitle}>{facultyName}</Text>
            </View>
          </View>

          <View style={[styles.rowStyle, basicStyles.justifyBetween]}>
            <View style={[styles.rowStyle, basicStyles.flexOne]}>
              <Text style={styles.headText}>Start Date</Text>
              <Text style={styles.midText}> - </Text>
              <Text style={styles.subTitle}>{startedOn}</Text>
            </View>
            <View style={[styles.rowStyle, basicStyles.flexOne]}>
              <Text style={styles.headText}>End Date</Text>
              <Text style={styles.midText}> - </Text>
              <Text style={styles.subTitle}>{endOn}</Text>
            </View>
          </View>

          <View style={[styles.rowStyle, basicStyles.justifyBetween]}>
            <View style={[styles.rowStyle, basicStyles.flexOne]}>
              <Text style={styles.headText}>Time</Text>
              <Text style={styles.midText}> - </Text>
              <Text style={styles.subTitle}>{batchTime}</Text>
            </View>
            <View style={[styles.rowStyle, basicStyles.flexOne]}>
              <Text style={styles.headText}>Status</Text>
              <Text style={styles.midText}> - </Text>
              <Text style={styles.subTitle}>{batchStatus}</Text>
            </View>
          </View>
        </View>

        {assignmentData ? (
          <View style={styles.assignmentContainer}>
            <View style={[basicStyles.paddingBottom]}>
              <Text style={styles.textStyle}>Batch Assignment</Text>

              <View
                style={[
                  styles.rowStyle,
                  basicStyles.paddingHalfHorizontal,
                  basicStyles.justifyBetween,
                  {marginBottom: wp(-1)},
                ]}>
                <Text
                  style={[
                    styles.serialText,
                    {flex: 0, textAlign: 'center', fontWeight: '700'},
                  ]}>
                  Sr No.
                </Text>
                <Text
                  style={[
                    styles.midText2,
                    {
                      flex: 1,
                      textAlign: 'center',
                      marginLeft: wp(4),
                      fontWeight: '700',
                    },
                  ]}>
                  Given On
                </Text>
                <Text
                  style={[
                    styles.midText2,
                    {flex: 1, textAlign: 'center', fontWeight: '700'},
                  ]}>
                  Submitted
                </Text>
                <Text
                  style={[
                    styles.midText2,
                    {flex: 1, textAlign: 'center', fontWeight: '700'},
                  ]}>
                  Not Submitted
                </Text>
              </View>

              <FlatList
                data={this.state.assignmentData}
                renderItem={this.renderAssignments}
                keyExtractor={this.keyExtractor}
                // ItemSeparatorComponent={this.itemSeparator}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.notesListContent}
              />
            </View>
          </View>
        ) : null}

        <View style={styles.mainContainer}>
          {this.state.studentDetails ? (
            <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
              <Text style={styles.textStyle}>Students List</Text>
              <FlatList
                data={this.state.studentDetails}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                ItemSeparatorComponent={this.itemSeparator}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.notesListContent}
              />
            </View>
          ) : (
            <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
              <Text style={basicStyles.noDataTextStyle}>No data found...</Text>
            </View>
          )}
        </View>
        {this.state.showAssignPop && (
          <SAssignmentPopUp
            closePopup={this.closePopup}
            nav={this.props.navigation}
          />
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
  assignmentContainer: {
    backgroundColor:
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      60,
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

  contentContainer: {
    // borderWidth: 2,
    backgroundColor:
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      60,
    marginTop: wp(2),
    padding: wp(3),
    borderRadius: wp(1),
    minHeight: wp(35),
  },
  nameStyle: {
    color: '#111',
    fontSize: wp(4.5),
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  infoContainer: {
    flexDirection: 'row',
    marginTop: wp(2),
    paddingBottom: wp(3),
    borderBottomWidth: 1.1,
    borderColor: '#999',
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: wp(0.5),
  },
  headText: {
    // flex: 1,
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  midText: {
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  subTitle: {
    // flex: 2,
    color: '#111',
    fontSize: wp(3),
    textTransform: 'capitalize',
    textAlign: 'right',
  },
  serialText: {
    // flex: 1,
    width: wp(12),
    color: '#333',
    fontSize: wp(3.2),
    // borderWidth: 1,
    textAlign: 'center',
    // marginLeft: wp(3),
  },
  midText2: {
    flex: 1,
    // flex: 2,
    color: '#333',
    fontSize: wp(3.2),
    textAlign: 'center',
    // marginLeft: wp(2),
  },
  subTitle2: {
    flex: 1,
    // flex: 1.2,
    color: '#333',
    fontSize: wp(3.2),
    textAlign: 'center',
    // textAlign: 'right',
  },
  mainContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
