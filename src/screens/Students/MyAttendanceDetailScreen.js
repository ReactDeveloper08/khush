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
import MyAttendanceDetailComponent from '../../components/Student/MyAttendanceDetailComponent';
import HrAssignmentNotSubmittedComponent from '../../components/HrAdmin/HrAssignmentNotSubmittedComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';
import SAssignmentPopUp from '../../components/SuperAdmin/SPopUpComponent/SAssignmentPopUp';
import {clearData} from '../../api/UserPreference';
import showToast from '../../components/CustomToast';
// network alert
import NetInfo from '@react-native-community/netinfo';
import offline from '../../assets/icons/internetConnectionState.gif';
export default class MyAttendanceDetailScreen extends Component {
  constructor(props) {
    super(props);
    const batchInfo = props.navigation.getParam('batchInfo', null);
    this.batchInfo = batchInfo;

    this.state = {
      isLoading: false,
      studentDetails: null,
      facultyDetails: null,
      connectionState: true,
      batchDetails: batchInfo,

      attendanceData: [],
      submittedData: null,
      notSubmittedData: null,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchStudentAttendance();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchStudentAttendance = async () => {
    const {studentId, batchId} = this.batchInfo;

    try {
      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        sId: studentId,
        bId: batchId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'studentAttendance',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {
            batchDetails,
            studentDetails = null,
            facultyDetails = null,
          } = response;

          this.setState({
            studentDetails,
            facultyDetails,
            status: null,
            isLoading: false,
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
            studentDetails: null,
            facultyDetails: null,
            isLoading: false,
            isRefreshing: false,
          });
        }
      } else {
        this.setState({
          submittedData: null,
          notSubmittedData: null,
          isLoading: false,
          isRefreshing: false,
        });

        showToast('Network Request Error');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('LoggedOut');
  };

  renderSubmitted = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <MyAttendanceDetailComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
      />
    );
  };
  renderNotSubmitted = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <HrAssignmentNotSubmittedComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {studentDetails, facultyDetails, batchDetails} = this.state;

    const {
      studentId,
      studentName,
      batchCode,
      batchId,
      subject,
      faculty,
      batchTime,
      batchStatus,
      StartDate,
      endDate,
      branchName,
    } = batchDetails;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title="Attendance Detail"
              nav={this.props.navigation}
              navAction="back"
            />
            <View style={styles.contentContainer}>
              <View style={styles.rowStyle}>
                <Text style={styles.nameStyle}>{subject} </Text>
                <Text
                  style={[
                    basicStyles.text,
                    basicStyles.textBold,
                    {color: '#111'},
                  ]}>
                  ({branchName})
                </Text>
              </View>

              <View style={[styles.rowStyle, basicStyles.justifyBetween]}>
                <View style={[styles.rowStyle, basicStyles.flexOne]}>
                  <Text style={styles.headText}>Batch Code</Text>
                  <Text style={styles.midText}> - </Text>
                  <Text
                    style={[
                      styles.subTitle,
                      basicStyles.flexOne,
                      {textAlign: 'left'},
                    ]}>
                    {batchCode}
                  </Text>
                </View>
                <View style={[styles.rowStyle, basicStyles.flexOne]}>
                  <Text style={styles.headText}>Faculty</Text>
                  <Text style={styles.midText}> - </Text>
                  <Text style={styles.subTitle}>{faculty}</Text>
                </View>
              </View>

              <View style={[styles.rowStyle, basicStyles.justifyBetween]}>
                <View style={[styles.rowStyle, basicStyles.flexOne]}>
                  <Text style={styles.headText}>Start Date</Text>
                  <Text style={styles.midText}> - </Text>
                  <Text style={styles.subTitle}>{StartDate}</Text>
                </View>
                <View style={[styles.rowStyle, basicStyles.flexOne]}>
                  <Text style={styles.headText}>End Date</Text>
                  <Text style={styles.midText}> - </Text>
                  <Text style={styles.subTitle}>{endDate}</Text>
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
            {studentDetails ? (
              <View style={styles.mainContainer}>
                <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
                  <Text style={styles.textStyle}>Student Absent List</Text>
                  <FlatList
                    data={studentDetails}
                    renderItem={this.renderSubmitted}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={this.itemSeparator}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatListStyle}
                  />
                </View>
              </View>
            ) : (
              <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
                <Text style={basicStyles.noDataTextStyle}>
                  No Data Found...
                </Text>
              </View>
            )}
            {studentDetails ? (
              <View style={styles.mainContainer}>
                <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
                  <Text style={styles.textStyle}>Faculty Absent List</Text>
                  <FlatList
                    data={studentDetails}
                    renderItem={this.renderSubmitted}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={this.itemSeparator}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatListStyle}
                  />
                </View>
              </View>
            ) : (
              <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
                <Text style={basicStyles.noDataTextStyle}>
                  No Data Found...
                </Text>
              </View>
            )}
          </>
        )}
        {this.state.connectionState === false && (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        )}
        {/* {notSubmittedData ? (
          <View style={styles.flatListStyle2}>
            <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
              <Text style={styles.textStyle}>Not Submitted</Text>
              <FlatList
                data={notSubmittedData}
                renderItem={this.renderNotSubmitted}
                keyExtractor={this.keyExtractor}
                ItemSeparatorComponent={this.itemSeparator}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.flatListStyle}
              />
            </View>
          </View>
        ) : null} */}
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
  flatListStyle: {
    padding: wp(2),
    // flex: 1,
    // marginTop: wp(1),
  },
  flatListStyle2: {
    flex: 0.8,
    // marginTop: wp(1),
  },
  mainContainer: {
    flex: 0.8,
    backgroundColor: '#fff',
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
    fontSize: wp(5),
    fontWeight: '700',
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
    color: '#444',
    fontSize: wp(3),
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
