import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, Alert, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
// import firebase from 'react-native-firebase';

// Components
import HeaderComponent from '../../components/HeaderComponent';
import AssignmentComponent from '../../components/Student/AssignmentComponent';
import CustomLoader from '../../components/CustomLoader';
// network alert
import NetInfo from '@react-native-community/netinfo';
import offline from '../../assets/icons/internetConnectionState.gif';
// Styles
import basicStyles from '../../styles/BasicStyles';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData, clearData} from '../../api/UserPreference';
import showToast from '../../components/CustomToast';

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);

    const stInfo = props.navigation.getParam('stInfo', null);

    this.state = {
      isLoading: true,
      viewBatchAssignment: null,
      studentInfo: stInfo,
      connectionState: true,
      status: null,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchStudentAssignments();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchStudentAssignments = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      const {s_id} = userInfo;
      // const {studentId, batchId} = userInfo;
      console.log('====================================');
      console.log('$$$', userInfo);
      console.log('====================================');

      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        studentId: s_id,
        // batchId: batchId,
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
      <AssignmentComponent
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

    const {viewBatchAssignment, studentInfo, status, isRefreshing} = this.state;

    // const {
    //   batchCode,
    //   subject,
    //   faculty,
    //   studentId,
    //   StartDate,
    //   endDate,
    //   branchName,
    //   batchTime,
    //   batchStatus,
    // } = studentInfo;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <View style={styles.headerContainer}>
              <HeaderComponent
                title="My Assignments"
                // nav={this.props.navigation}
                // navAction="back"
                nav={this.props.navigation}
              />
            </View>

            {viewBatchAssignment ? (
              <View style={styles.mainContainer}>
                <View style={[basicStyles.flexOne]}>
                  {/* <Text style={styles.textStyle}>Assignments List</Text> */}
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
                </View>
              </View>
            ) : (
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>No Assignment Found...</Text>
              </View>
            )}
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
    // backgroundColor: '#fff',
  },
  textStyle: {
    padding: wp(3),
    fontSize: wp(4.8),
    fontWeight: '700',
  },
  headerContainer: {
    backgroundColor: '#096481',
  },
  listContentContainer: {
    padding: wp(2),
  },
  separator: {
    height: hp(2),
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

  contentContainer: {
    // borderWidth: 2,
    backgroundColor:
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55,
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
});
