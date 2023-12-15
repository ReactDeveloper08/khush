import React, {Component} from 'react';
import {View, Text, FlatList, StyleSheet, Image} from 'react-native';
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
import SAssignmentSubmittedComponent from '../../components/SuperAdmin/SAssignmentSubmittedComponent';
import SAssignmentNotSubmittedComponent from '../../components/SuperAdmin/SAssignmentNotSubmittedComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';
import SAssignmentPopUp from '../../components/SuperAdmin/SPopUpComponent/SAssignmentPopUp';

export default class HrAssignmentDetailScreen extends Component {
  constructor(props) {
    super(props);

    const assignmentInfo = props.navigation.getParam('assignmentInfo', null);
    this.assignmentInfo = assignmentInfo;

    this.state = {
      isLoading: true,
      studentDetails: null,
      assignmentInfo,
      connectionState: true,
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
      submittedData: null,
      notSubmittedData: null,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchAssignmentDetail();
  }
  componentWillUnmount() {
    this.unsubscribe();
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
        BASE_URL + 'getAssignmentDetail',
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
            submit,
            nonsubmit,
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
            submittedData: submit,
            notSubmittedData: nonsubmit,
            batchDetails,
            studentDetails,
            status: null,
            isLoading: false,
          });

          // resetting notification count
          // await this.resetNotificationCount(params);
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
      } else {
        this.setState({
          submittedData: null,
          notSubmittedData: null,
          isLoading: false,
          isRefreshing: false,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderSubmitted = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <SAssignmentSubmittedComponent
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
      <SAssignmentNotSubmittedComponent
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

    const {
      studentDetails,
      isRefreshing,
      assignmentInfo,
      batchDetails,
      submittedData,
      notSubmittedData,
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
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title="Assignment Detail"
              nav={this.props.navigation}
              navAction="back"
            />

            <View style={styles.contentContainer}>
              <View style={styles.rowStyle}>
                <Text style={styles.nameStyle}>{courseName} </Text>
                <Text style={[basicStyles.text, {color: '#333', flex: 1}]}>
                  ({branchName})
                </Text>

                <Text
                  style={[
                    {color: '#333', fontSize: wp(3), alignSelf: 'flex-end'},
                  ]}>
                  {batchCode}
                </Text>
              </View>

              <View
                style={[
                  styles.rowStyle,
                  {marginLeft: wp(2), alignItems: null},
                ]}>
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
                  <Text style={styles.subTitle}>
                    {batchStatus === 'Y' ? 'Running' : 'Completed'}
                  </Text>
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

            {submittedData ? (
              <View style={styles.mainContainer}>
                <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
                  <Text style={styles.textStyle}>Submitted</Text>
                  <FlatList
                    data={submittedData}
                    renderItem={this.renderSubmitted}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={this.itemSeparator}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.flatListStyle}
                  />
                </View>
              </View>
            ) : null}

            {notSubmittedData ? (
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
            ) : null}
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
  flatListStyle: {
    padding: wp(2),
    // flex: 1,
    // marginTop: wp(1),
  },
  flatListStyle2: {
    flex: 1,
    // marginTop: wp(1),
  },
  mainContainer: {
    flex: 1,
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
