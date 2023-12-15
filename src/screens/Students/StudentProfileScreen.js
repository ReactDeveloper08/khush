/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  RefreshControl,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import PaidModeComponent from '../../components/Student/PaidModeComponent';
import FeePlanComponent from '../../components/Student/FeePlanComponent';
import CourseInfoComponent from '../../components/Student/CourseInfoComponent';
import ExamsComponent from '../../components/Student/ExamsComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Images
import ic_pass_change from '../../assets/icons/ic_pass_change.png';

// Styles
import basicStyles from '../../styles/BasicStyles';
import {getData, KEYS} from '../../api/UserPreference';
// network alert
import NetInfo from '@react-native-community/netinfo';
import offline from '../../assets/icons/internetConnectionState.gif';
export default class StudentProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      studentsDetails: {
        studentImage: '',
        studentName: '',
        enrollNumber: '',
        branchName: '',
        fatherName: '',
        fatherOccupation: '',
        email: '',
        mobile: '',
        school: '',
        qualification: '',
        percentage: '',
        dateOfBirth: '',
        address: '',
        refBy: '',
        referByMobile: '',
        studentId: '',
        connectionState: true,
      },
      isListRefreshing: false,
      feePlanData: null,
      paidModeData: null,
      courseData: null,
      examData: null,
      showAbsentPopUp: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchStudentDetail();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchStudentDetail = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      const {s_id} = userInfo;

      // starting loader
      this.setState({isLoading: true});

      const params = {
        s_id: s_id,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'studentInfo',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {
            studentsDetails,
            courseDetails,
            paymenHistory,
            batchHistory,
            examHistory,
          } = response;

          this.setState({
            studentsDetails,
            feePlanData: courseDetails,
            paidModeData: paymenHistory,
            courseData: batchHistory,
            examData: examHistory,
            status: null,
            isLoading: false,
            isListRefreshing: false,
          });

          // resetting notification count
          // await this.resetNotificationCount(params);
        } else {
          const {message} = response;

          this.setState({
            status: message,
            studentsList: null,
            isLoading: false,
            isRefreshing: false,
            isListRefreshing: false,
          });
        }
        // }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleShowAttendancePop = data => {
    this.setState({showAbsentPopUp: true});
    this.popData = data;
  };

  closePopup = () => {
    this.setState({showAbsentPopUp: false});
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  renderFeePlanFlatList = () => {
    const {feePlanData} = this.state;

    return feePlanData.map((item, index) => {
      return <FeePlanComponent item={item} nav={this.props.navigation} />;
    });
  };
  renderPaidModeFlatList = () => {
    const {paidModeData} = this.state;

    // Grouping data by courseName
    const groupedData = paidModeData.reduce((result, item) => {
      if (!result[item.courseName]) {
        result[item.courseName] = [];
      }
      result[item.courseName].push(item);
      return result;
    }, {});

    return (
      <View>
        {Object.keys(groupedData).map((courseName, courseIndex) => (
          <View key={courseIndex}>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>{courseName}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableDataHeader,
                  styles.borderRight,
                  styles.borderLeft,
                ]}>
                Amount
              </Text>
              <Text style={[styles.tableDataHeader, styles.borderRight]}>
                Receipt No.
              </Text>
              <Text style={[styles.tableDataHeader, styles.borderRight]}>
                Paid on
              </Text>
            </View>
            {groupedData[courseName].map((receipt, receiptIndex) => (
              <View key={receiptIndex} style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableData,
                    styles.borderRight,
                    styles.borderLeft,
                  ]}>
                  {receipt.totalAmount}
                </Text>
                <Text style={[styles.tableData, styles.borderRight]}>
                  {receipt.receiptNo}
                </Text>
                <Text style={[styles.tableData, styles.borderRight]}>
                  {receipt.paymentDate}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  renderCourseInfoFlatList = () => {
    const {courseData} = this.state;

    return courseData.map((item, index) => {
      return <CourseInfoComponent item={item} nav={this.props.navigation} />;
    });
  };

  renderExamFlatList = () => {
    const {examData} = this.state;

    return examData.map((item, index) => {
      return <ExamsComponent item={item} nav={this.props.navigation} />;
    });
  };

  handlePassChange = () => {
    this.props.navigation.push('ChangePassword');
  };
  handleListRefresh = () => {
    try {
      this.setState({isListRefreshing: true});
      this.fetchStudentDetail();
    } catch (error) {
      console.log('error while calling list refresh', error);
    }
  };
  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {studentsDetails, feePlanData, paidModeData, courseData, examData} =
      this.state;
    console.log('====================================');
    console.log('########', courseData[0].batchTime);
    console.log('====================================');
    const {
      studentImage,
      studentName,
      enrollNumber,
      branchName,
      fatherName,
      fatherOccupation,
      mobile,
      qualification,
      percentage,
      dateOfBirth,
      address,
      refBy,
    } = studentsDetails;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Student Info" nav={this.props.navigation} />

            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isListRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              }>
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.justifyBetween,
                ]}>
                <View style={styles.rowStyle}>
                  <Text style={styles.nameStyle}>{studentName}</Text>
                  <Text style={{fontSize: wp(3)}}>({enrollNumber})</Text>
                  <TouchableOpacity
                    style={{marginLeft: wp(2)}}
                    onPress={this.handlePassChange}>
                    <Image
                      source={ic_pass_change}
                      resizeMode="cover"
                      style={basicStyles.iconColumn}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.headText, {flex: 0, fontWeight: null}]}>
                  {branchName}
                </Text>
              </View>

              <View style={styles.infoContainer}>
                <View>
                  <Image
                    source={{uri: studentImage}}
                    resizeMode="cover"
                    style={styles.userImage}
                  />
                </View>

                <View style={styles.contentContainer}>
                  <View style={styles.rowStyle}>
                    <Text style={styles.headText}>Father</Text>
                    <Text style={styles.midText}> - </Text>
                    <Text style={styles.subTitle}>{fatherName}</Text>
                  </View>
                  <View style={styles.rowStyle}>
                    <Text style={styles.headText}>Occ.</Text>
                    <Text style={styles.midText}> - </Text>
                    <Text style={styles.subTitle}>{fatherOccupation}</Text>
                  </View>
                  <View style={styles.rowStyle}>
                    <Text style={styles.headText}>Mob</Text>
                    <Text style={styles.midText}> - </Text>
                    <Text style={styles.subTitle}>{mobile}</Text>
                  </View>
                  {/* <View style={styles.rowStyle}>
                <Text style={styles.headText}>Email</Text>
                <Text style={styles.midText}> - </Text>
                <Text style={styles.subTitle}>{email}</Text>
              </View> */}
                  <View style={styles.rowStyle}>
                    <Text style={styles.headText}>Qual</Text>
                    <Text style={styles.midText}> - </Text>
                    <Text style={styles.subTitle}>{qualification}</Text>
                  </View>
                  <View style={styles.rowStyle}>
                    <Text style={styles.headText}>Per(%)</Text>
                    <Text style={styles.midText}> - </Text>
                    <Text style={styles.subTitle}>{percentage}</Text>
                  </View>
                  <View style={styles.rowStyle}>
                    <Text style={styles.headText}>DOB</Text>
                    <Text style={styles.midText}> - </Text>
                    <Text style={styles.subTitle}>{dateOfBirth}</Text>
                  </View>
                  {refBy ? (
                    <View style={styles.rowStyle}>
                      <Text style={styles.headText}>RefBy</Text>
                      <Text style={styles.midText}> - </Text>
                      <Text style={styles.subTitle}>{refBy}</Text>
                    </View>
                  ) : null}
                  {/* <View style={[styles.rowStyle, {alignItems: null}]}>
                <Text style={styles.headText}>Address</Text>
                <Text style={styles.midText}> - </Text>
                <Text style={styles.subTitle}>{address}</Text>
              </View> */}
                </View>
              </View>

              <View
                style={[
                  styles.infoContainer2,
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  // basicStyles.justifyBetween,
                ]}>
                <View style={[styles.rowStyle, {alignItems: null}]}>
                  <Text style={styles.headText}>Address</Text>
                  <Text style={[styles.midText, {marginLeft: wp(-2)}]}>
                    {' '}
                    -{' '}
                  </Text>
                  <Text
                    style={[
                      styles.subTitle,
                      {textAlign: 'left', marginLeft: wp(2)},
                    ]}>
                    {address}
                  </Text>
                </View>
              </View>

              {/* {feePlanData ? (
                <View style={styles.feePlanContainer}>
                  <Text
                    style={[styles.headingText, basicStyles.marginBottomHalf]}>
                    Course Detail
                  </Text>

                  {this.renderFeePlanFlatList()}
                </View>
              ) : null} */}

              {paidModeData ? (
                <View style={styles.paidModeContainer}>
                  <Text
                    style={[styles.headingText, basicStyles.marginBottomHalf]}>
                    Payment History
                  </Text>

                  {this.renderPaidModeFlatList()}
                </View>
              ) : null}

              {courseData ? (
                <View style={[styles.paidModeContainer, {padding: wp(1)}]}>
                  <Text
                    style={[
                      styles.headingText,
                      basicStyles.marginBottomHalf,
                      {paddingLeft: wp(1)},
                    ]}>
                    Batch History
                  </Text>
                  {this.renderCourseInfoFlatList()}
                </View>
              ) : null}

              {examData ? (
                <View style={styles.examContainer}>
                  <Text
                    style={[styles.headingText, basicStyles.marginBottomHalf]}>
                    Exam
                  </Text>

                  {this.renderExamFlatList()}
                </View>
              ) : null}
            </ScrollView>
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
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  tableHeader: {
    flex: 1,
    // padding: 5,
    paddingBottom: wp(2),
    fontWeight: 'bold',
    // textAlign: 'center',
    color: '#444',
    fontSize: wp(3.2),
  },
  tableDataHeader: {
    flex: 1,
    padding: 8,
    // fontWeight: 'bold',
    textAlign: 'center',
    borderColor: 'black',
    backgroundColor: '#fff',
    // fontSize: wp(3.2),
    color: '#444',
    fontSize: wp(3),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  tableData: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    borderColor: 'black',
    backgroundColor: '#fff',
    color: '#444',
    fontSize: wp(3.2),
  },
  borderRight: {
    borderRightWidth: 1,
    borderColor: 'black',
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderColor: 'black',
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  mainContainer: {
    flex: 1,
    padding: wp(2),
  },

  headingText: {
    fontSize: wp(3.5),
    fontWeight: '700',
  },

  buttonStyle: {
    backgroundColor: '#1d99d2',
    width: wp(40),
    alignSelf: 'center',
    marginTop: hp(4),
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(1),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp(4),
  },
  textStyle: {
    padding: wp(3),
    fontSize: wp(4.8),
    fontWeight: '700',
  },

  // Student Style

  infoContainer: {
    flexDirection: 'row',
    marginTop: wp(2),
    // paddingBottom: wp(3),
    // borderBottomWidth: 1.1,
    // borderColor: '#999',
    // alignItems: 'center',
  },

  infoContainer2: {
    flexDirection: 'row',
    marginTop: wp(1.2),
    paddingBottom: wp(3),
    borderBottomWidth: 1.1,
    borderColor: '#999',
    // alignItems: 'center',
  },
  userImage: {
    width: hp(15),
    aspectRatio: 1 / 1,
    borderRadius: wp(1),
  },
  contentContainer: {
    // borderWidth: 2,
    flex: 1,
    marginHorizontal: wp(2),
  },
  nameStyle: {
    color: '#1d99d2',
    fontSize: wp(3.3),
    fontWeight: '700',
    marginLeft: wp(2),
    marginTop: wp(2),
    marginBottom: wp(2),
    // textAlign: 'center',s
  },
  headText: {
    flex: 0.5,
    color: '#333',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  midText: {
    color: '#333',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  subTitle: {
    flex: 2,
    color: '#333',
    fontSize: wp(3),

    textAlign: 'left',
    marginLeft: wp(2),
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Fee Plan
  feePlanContent: {
    marginTop: wp(1),
  },
  feePlanContainer: {
    marginTop: wp(3),
    padding: wp(2),
    backgroundColor: '#9995',
    borderRadius: wp(2),
  },
  serialText: {
    flex: 1,
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: '700',
    // marginLeft: wp(2),
  },
  midText2: {
    // flex: 2,
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  subTitle2: {
    flex: 1.2,
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: '700',
    textAlign: 'right',
  },

  // Paid Mode
  paidModeContainer: {
    marginTop: hp(3),
    padding: wp(2),
    backgroundColor: '#9995',
    borderRadius: wp(2),
  },
  examContainer: {
    marginTop: hp(3),
    marginBottom: wp(5),
    padding: wp(2),
    backgroundColor: '#9995',
    borderRadius: wp(2),
  },
  // Exam
  mainContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: hp(1.2),
  },
  userImage2: {
    width: hp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(1),
  },
  statusText: {
    textAlign: 'right',
    flex: 1,
    color: '#000',
    fontSize: wp(3),
    fontWeight: '700',
  },
  contentContainer2: {
    // borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: wp(2),
  },
  rowStyle2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameStyle2: {
    color: '#444',
    fontSize: wp(3.2),
    fontWeight: '700',
  },
  headText2: {
    // flex: 1,
    textAlign: 'left',
    color: '#444',
    fontSize: wp(2.8),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  midText3: {
    color: '#666',
    fontSize: wp(2.8),
    fontWeight: '700',
    // marginLeft: wp(2),
  },
  subTitle3: {
    // flex: 2,
    color: '#666',
    fontSize: wp(2.8),
    textAlign: 'right',
  },
});
