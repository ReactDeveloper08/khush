/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
// import firebase from 'react-native-firebase';

// Components
import HeaderComponent from '../../components/HeaderComponent';
import MarkAssignmentComponent from '../../components/HrAdmin/MarkAssignmentComponent';
import CustomLoader from '../../components/CustomLoader';
import ProcessingLoader from '../../components/ProcessingLoader';
import showToast from '../../components/CustomToast';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../../api/UserPreference';
import basicStyles from '../../styles/BasicStyles';

export default class HrUpdateAssignmentScreen extends Component {
  constructor(props) {
    super(props);

    const assignmentInfo = props.navigation.getParam('assignmentInfo', null);

    this.assignmentInfo = assignmentInfo;

    this.state = {
      isLoading: true,
      studentDetails: null,
      assignmentInfo,

      batchDetails: {
        batchId: '',
        branchId: '',
        batchCode: '',
        branchName: '',
        courseName: '',
        facultyName: '',
        startedOn: '',
        endOn: '',
        batchTime: '',
        batchType: '',
        batchStatus: '',
        facultyAbsent: '',
      },

      assignmentData: [],

      isRefreshing: false,
    };
    this.studentsList = new Set();
  }

  componentDidMount() {
    this.fetchAssignmentDetail();
  }

  fetchAssignmentDetail = async () => {
    const {assignmentId} = this.assignmentInfo;

    try {
      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        assignmentId: assignmentId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'viewUpdateAssignment',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {
            branchName,
            courseName,
            bathStartDate,
            batchEndDate,
            batchTime,
            batchStatus,
            facultyName,
            givenOn,
            studentDetails,
            student,
          } = response;

          let batchDetails = {
            batchId: '',
            branchId: '',
            batchCode: '',
            branchName,
            courseName,
            facultyName: '',
            startedOn: bathStartDate,
            endOn: batchEndDate,
            batchTime,
            batchType: '',
            batchStatus: batchStatus,
          };

          this.setState({
            batchDetails,
            studentDetails: student,
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

  handleReviewAssignment = async () => {
    const {assignmentData} = this.state;

    const {assignmentId, facultyId} = this.assignmentInfo;

    try {
      // starting loader
      this.setState({isProcessing: true});

      // preparing params
      const params = {
        assignmentId: assignmentId,
        facultyId: facultyId,
        assignmentData: JSON.stringify(assignmentData),
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'assignmentReview',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success, message: toastMessage} = response;

        if (success) {
          this.setState({
            isProcessing: false,
          });
          const {pop, getParam} = this.props.navigation;
          const fetchAssignment = await getParam('fetchAssignment', null);
          await this.fetchAssignmentDetail();
          showToast(toastMessage);
          await fetchAssignment();
          pop();
        } else {
          this.setState({
            isProcessing: false,
          });
        }
        // }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // handleListRefresh = async () => {
  //   try {
  //     // pull-to-refresh
  //     this.setState({isRefreshing: true}, () => {
  //       // updating list
  //       this.componentDidMount();
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  handleUpdateAssignment = (isSubmit, data) => {
    let {assignmentData} = this.state;

    if (isSubmit) {
      assignmentData.push(data);

      this.setState({assignmentData: assignmentData});
    } else {
      const index = assignmentData.findIndex(
        item => item.studentId === data.studentId,
      );
      assignmentData.splice(index, 1);

      this.setState({assignmentData});
    }
  };

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;

    const {assignmentInfo} = this.state;

    const {givenOn} = assignmentInfo;

    return (
      <MarkAssignmentComponent
        item={item}
        givenDate={givenOn}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
        handleUpdateAssignment={this.handleUpdateAssignment}
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

    const {
      studentDetails,
      isRefreshing,
      assignmentInfo,
      batchDetails,
      isProcessing,
    } = this.state;

    const {
      branchName,
      courseName,

      startedOn,
      endOn,
      batchTime,

      batchStatus,
    } = batchDetails;

    const {title, batchCode, givenOn, faculty, submittedBy, notSubmitted} =
      assignmentInfo;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <HeaderComponent
            title="Update Assignment Record"
            nav={this.props.navigation}
            navAction="back"
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.rowStyle}>
            <Text style={styles.nameStyle}>{courseName} </Text>
            <Text style={[basicStyles.text, {color: '#333', flex: 1}]}>
              ({branchName})
            </Text>

            <Text
              style={[{color: '#333', fontSize: wp(3), alignSelf: 'flex-end'}]}>
              {batchCode}
            </Text>
          </View>

          <View
            style={[styles.rowStyle, {marginLeft: wp(2), alignItems: null}]}>
            <Text style={styles.assNameStyle}>Assignment : </Text>
            <Text
              style={[
                styles.subTitle,
                {color: '#333', flex: 1, textAlign: 'left'},
              ]}>
              {title}
            </Text>
          </View>

          <View style={[styles.rowStyle, basicStyles.justifyBetween]}>
            <View style={styles.rowStyle}>
              <Text style={styles.headText}>Start Date</Text>
              <Text style={styles.midText}> - </Text>
              <Text style={styles.subTitle}>{startedOn}</Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.headText}>End Date</Text>
              <Text style={styles.midText}> - </Text>
              <Text style={styles.subTitle}>{endOn}</Text>
            </View>
          </View>

          <View style={[styles.rowStyle, basicStyles.justifyBetween]}>
            <View style={styles.rowStyle}>
              <Text style={styles.headText}>Time</Text>
              <Text style={styles.midText}> - </Text>
              <Text style={styles.subTitle}>{batchTime}</Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.headText}>Status</Text>
              <Text style={styles.midText}> - </Text>
              <Text style={styles.subTitle}>{batchStatus}</Text>
            </View>
          </View>

          <View style={[styles.rowStyle, basicStyles.justifyBetween]}>
            <View style={styles.rowStyle}>
              <Text style={styles.headText}>Faculty</Text>
              <Text style={styles.midText}> - </Text>
              <Text style={styles.subTitle}>{faculty}</Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.headText}>Given On</Text>
              <Text style={styles.midText}> - </Text>
              <Text style={styles.subTitle}>{givenOn}</Text>
            </View>
          </View>
        </View>

        <View style={[basicStyles.marginBottom, basicStyles.flexOne]}>
          <Text style={styles.textStyle}>Students List </Text>

          <View
            style={[
              styles.infoContainer,
              // basicStyles.paddingHalfHorizontal,
            ]}>
            <Text style={[styles.serialText]}>Enroll No</Text>
            <Text
              style={[
                styles.midText2,
                {flex: 1.3, textAlign: 'left', paddingLeft: wp(4)},
              ]}>
              Student
            </Text>
            <Text style={[styles.midText2, {flex: 0.9, textAlign: 'left'}]}>
              Date
            </Text>
            <Text style={[styles.midText2, {flex: 0.8, textAlign: 'left'}]}>
              Grade
            </Text>
          </View>
          <View style={basicStyles.flexOne}>
            <FlatList
              data={studentDetails}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContentContainer}
              refreshing={isRefreshing}
              onRefresh={this.handleListRefresh}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.handleReviewAssignment}>
            <Text style={styles.buttonText3}>Update Record</Text>
          </TouchableOpacity>
        </View>
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
  messageText: {
    color: '#000',
    fontSize: wp(3.5),
    textAlign: 'center',
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
  loginFormTextInput: {
    height: hp(5),
    width: wp(85),
    fontSize: wp(3),
    borderWidth: 0.8,
    borderColor: '#999',
    textAlignVertical: 'top',
    borderRadius: wp(1),
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
  },
  selectedDate: {
    color: '#777',
    fontSize: wp(3),
  },
  serialText: {
    // flex: 1,
    width: wp(15),
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: '700',
    // borderWidth: 1,
    textAlign: 'center',
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
  buttonText3: {
    color: '#fff',
    fontSize: wp(3.5),
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
  nameStyle: {
    color: '#111',
    fontSize: wp(3.8),
    fontWeight: '700',
  },
  assNameStyle: {
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: '700',
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
});
