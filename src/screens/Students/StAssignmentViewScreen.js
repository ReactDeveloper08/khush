import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
// import firebase from 'react-native-firebase';

// Components
import HeaderComponent from '../../components/HeaderComponent';
import showToast from '../../components/CustomToast';
import HrAssignmentViewComponent from '../../components/HrAdmin/HrAssignmentViewComponent';
import CustomLoader from '../../components/CustomLoader';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData, clearData} from '../../api/UserPreference';
import basicStyles from '../../styles/BasicStyles';

export default class HrAssignmentViewScreen extends Component {
  constructor(props) {
    super(props);

    const stInfo = props.navigation.getParam('stInfo', null);

    this.state = {
      isLoading: true,
      viewBatchAssignment: null,
      studentInfo: stInfo,
      showImagePopup: false,
      status: null,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.fetchStudentAssignments();
  }

  fetchStudentAssignments = async () => {
    try {
      const stInfo = await this.props.navigation.getParam('stInfo', null);

      const {studentId, batchId} = stInfo;

      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        studentId: studentId,
        batchId: batchId,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'viewBatchAssignment',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {viewBatchAssignment} = response;
          this.setState({
            viewBatchAssignment,
            status: null,
            isLoading: false,
            isRefreshing: false,
          });

          // resetting notification count
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
            viewBatchAssignment: null,
            isLoading: false,
            isRefreshing: false,
          });
        }
      } else {
        this.setState({
          viewBatchAssignment: null,
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

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <HrAssignmentViewComponent
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

    const {viewBatchAssignment, studentInfo, isRefreshing} = this.state;

    const {
      batchCode,
      subject,
      faculty,
      studentId,
      StartDate,
      endDate,
      branchName,
      batchTime,
      batchStatus,
    } = studentInfo;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <HeaderComponent
            title="Assignments List "
            navAction="back"
            nav={this.props.navigation}
          />
        </View>

        {/* <View style={styles.contentContainer}>
          <View style={styles.rowStyle}>
            <Text style={styles.nameStyle}>{subject} </Text>
            <Text
              style={[basicStyles.text, basicStyles.textBold, {color: '#111'}]}>
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
        </View> */}

        <View style={[basicStyles.flexOne, basicStyles.paddingBottom]}>
          {/* <Text style={styles.textStyle}>Assignments List</Text> */}
          {viewBatchAssignment ? (
            <FlatList
              data={viewBatchAssignment}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContentContainer}
              refreshing={isRefreshing}
              onRefresh={this.handleListRefresh}
            />
          ) : (
            <View style={[basicStyles.noDataStyle, basicStyles.flexOne]}>
              <Text style={basicStyles.noDataTextStyle}>
                No Assignment Found
              </Text>
            </View>
          )}
        </View>
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
  addButtonStyle: {
    backgroundColor: '#444',
    position: 'absolute',
    padding: wp(2),
    borderRadius: wp(7),
    bottom: wp(5),
    right: wp(5),
  },
  addAssignIcon: {
    height: wp(7),
    aspectRatio: 1 / 1,
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
    height: wp(32),
  },
  nameStyle: {
    color: '#111',
    fontSize: wp(4.5),
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
    textTransform: 'capitalize',
  },
});
