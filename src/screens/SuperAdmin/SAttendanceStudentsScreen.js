/* eslint-disable react-native/no-inline-styles */
// HrAttendanceStudentsScreen
import React, {Component} from 'react';
import {View, Text, FlatList, StyleSheet, Image, Alert} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CheckBox from '@react-native-community/checkbox';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import SAttendanceDetailComponent from '../../components/SuperAdmin/SAttendanceDetailComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';

export default class HrAttendanceStudentsScreen extends Component {
  constructor(props) {
    super(props);

    const batchInfo = props.navigation.getParam('batchInfo', null);
    this.batchInfo = batchInfo;
    console.log('*******', batchInfo);
    this.state = {
      studentDetails: [],
      connectionState: true,
      batchDetails: {
        batchId: '',
        branchId: '',
        branchName: '',
        courseName: '',
        startedOn: '',
        endOn: '',
        batchTime: '',
        batchType: '',
        batchStatus: '',
        facultyAbsent: '',
      },

      showAssignPop: false,
      isRefreshing: false,
      isFacultyAbsent: false,
      isLoading: true,
      isProcessing: false,
    };

    this.presentList = new Set();
    this.absentList = new Set();
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchBatchAttendance();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchBatchAttendance = async () => {
    const {batchId} = this.batchInfo;

    try {
      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        b_id: batchId,
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

          const {facultyAbsent} = batchDetails;

          studentDetails.forEach(item => {
            if (item.ispresent === 'N') {
              this.absentList.add(item.studentId);
            } else if (item.ispresent === 'Y') {
              this.presentList.add(item.studentId);
            }
          });

          this.studentDetails = studentDetails;

          this.setState({
            batchDetails,
            studentDetails,
            assignmentData: studentAssignment,
            isFacultyAbsent: facultyAbsent === 'N' ? false : true,
            status: null,
            isLoading: false,
          });
        } else {
          const {message} = response;

          this.setState({
            status: message,
            notification: null,
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

  handleMarkAttendance = (isAbsent, studentId) => {
    if (isAbsent) {
      this.absentList.add(studentId);
      this.presentList.delete(studentId);
    } else {
      this.absentList.delete(studentId);
      this.presentList.add(studentId);
    }
  };
  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <SAttendanceDetailComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
        handleMarkAttendance={this.handleMarkAttendance}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleUpdateAttendance = () => {
    this.props.navigation.pop();
    Alert.alert('Attendance', 'Attendance Updated');
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

  render() {
    const {isLoading} = this.state;

    if (isLoading) {
      return <CustomLoader />;
    }

    const {batchDetails, isFacultyAbsent, isRefreshing, studentDetails} =
      this.state;

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
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title="Manage Attendance"
              nav={this.props.navigation}
              navAction="back"
            />

            <View style={styles.contentContainer}>
              <View style={styles.rowStyle}>
                <Text style={styles.nameStyle}>{courseName} </Text>
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

              <View style={[styles.rowStyle]}>
                <Text style={styles.facultyNameStyle}>Faculty Absent</Text>
                <CheckBox
                  style={styles.checkBoxStyle}
                  value={isFacultyAbsent}
                  disabled={true}
                  boxType="square"
                  tintColors={{true: '#333', false: '#333'}}
                  onFillColor="#fff"
                />
              </View>
            </View>

            <View style={styles.mainContainer}>
              <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
                <Text style={styles.textStyle}>Batch Students List</Text>

                <View
                  style={[
                    styles.infoContainer,
                    // basicStyles.paddingHalfHorizontal,
                  ]}>
                  <Text style={[styles.serialText]}>Absent</Text>
                  <Text style={[styles.midText2, {flex: 1.2}]}>Enroll No.</Text>
                  <Text
                    style={[
                      styles.midText2,
                      {flex: 1.5, textAlign: 'left', paddingLeft: wp(2)},
                    ]}>
                    Student
                  </Text>
                  <Text
                    style={[
                      styles.midText2,
                      {flex: 1.4, textAlign: 'center', marginLeft: wp(0)},
                    ]}>
                    Status
                  </Text>
                </View>

                <FlatList
                  data={studentDetails}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  ItemSeparatorComponent={this.itemSeparator}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.notesListContent}
                  refreshing={isRefreshing}
                  onRefresh={this.handleListRefresh}
                />
                {/* <TouchableOpacity
              style={styles.buttonStyle}
              onPress={this.handleUpdateAttendance}>
              <Text style={styles.buttonText}>Mark Absent</Text>
            </TouchableOpacity> */}
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

  textStyle: {
    padding: wp(3),
    fontSize: wp(4.8),
    fontWeight: '700',
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
    minHeight: wp(40),
  },

  facultyContainer: {
    // borderWidth: 2,
    // marginTop: wp(2),
    // padding: wp(3),
    // borderRadius: wp(1),
    // height: hp(6),
  },
  nameStyle: {
    color: '#111',
    fontSize: wp(4),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  facultyNameStyle: {
    color: '#333',
    fontSize: wp(3.5),
    fontWeight: '700',
    padding: wp(2),
    textTransform: 'capitalize',
  },
  endText: {
    color: '#111',
    fontSize: wp(3.5),
    fontWeight: '700',
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: wp(0.5),
    justifyContent: 'space-between',
    backgroundColor: '#888',
    padding: wp(2),
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
    textTransform: 'capitalize',
  },
  midText: {
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
    textTransform: 'capitalize',
  },
  subTitle: {
    // flex: 2,
    color: '#444',
    fontSize: wp(3),
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  serialText: {
    // flex: 1,
    width: wp(13),
    color: '#333',
    fontSize: wp(3),
    fontWeight: '700',
    // borderWidth: 1,
    textAlign: 'center',
    // marginLeft: wp(3),
  },
  midText2: {
    flex: 1,

    color: '#333',
    fontWeight: '700',
    fontSize: wp(3),
    textAlign: 'center',
  },
  subTitle2: {
    flex: 1,
    color: '#333',
    fontWeight: '700',
    fontSize: wp(3),
    textAlign: 'center',
  },
  mainContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonStyle: {
    marginTop: wp(2),
    height: wp(12),
    width: wp(50),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d99d2',
    borderRadius: wp(1),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(3.5),
    fontWeight: '700',
  },
  checkBoxStyle: {
    height: hp(2),
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
