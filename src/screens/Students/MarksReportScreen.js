import React, {Component} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderComponent from '../../components/HeaderComponent';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomLoader from '../../components/CustomLoader';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {KEYS, getData} from '../../api/UserPreference';
export default class MarksReportScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      quiz: null,
      status: null,
      connectionState: true,
      isRefreshing: false,
      data: [],
      role: [],
    };
    this.courseName = this.props.navigation.getParam('courseName', null);
    console.log('tttttttt', this.courseName);
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.handleData();
  }
  handleData = async () => {
    try {
      const courseId = this.props.navigation.getParam('courseId', null);
      const course_name = this.props.navigation.getParam('course_name', null);
      this.setState({course_name: course_name});
      console.log('####', courseId);
      const userInfo = await getData(KEYS.USER_INFO);
      console.log('UserInfo:', userInfo); // Check the userInfo object to see if role is present

      const role = userInfo ? userInfo.role : null; // Assuming role property exists in userInfo object
      console.log('Role:', role); // Check the role value
      console.log('@@@@$#$', role);
      const params = {
        course_id: courseId,
      };

      // const response = await makeRequest(BASE_URL + 'quizRank', params, true);
      const response = await makeRequest(BASE_URL + 'quizRankV2', params, true);

      console.log('^^^^', response);

      if (response) {
        const {success, data} = response;
        console.log('~~!~!~', role);

        if (success) {
          // Assuming data is an array of objects from the API response
          this.setState({
            isLoading: false,
            data,
            role: role,
          });
          console.log('this', this.setState.role);
        } else {
          this.setState({
            isLoading: false, // Set loading state to false to indicate the end of loading
            connectionState: false, // Assuming there is a network error
            role: role,
          });
          console.log('this', this.setState.role);
        }
      }
    } catch (error) {
      // Handle network or other errors here
      console.error('Error fetching data:', error);
      this.setState({
        isLoading: false,
        connectionState: false,
      });
    }
  };
  handleroute = () => {
    const courseId = this.props.navigation.getParam('courseId', null);
    const courseName = this.props.navigation.getParam('courseName', null);
    const is_exist = this.props.navigation.getParam('is_exist', null);
    if (is_exist === 'Y') {
      // Show an alert if is_exist is 'Y'
      alert(
        'Thanks for participating! Youve already taken the quiz today. Come back tomorrow for a new challenge.',
      );
      return;
    }
    this.props.navigation.navigate('QuizQuestion', {courseId, courseName});
  };
  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {courseName} = this;
    const {role} = this.state;
    console.log('@!~!~!', role);
    if (!this.state.data || this.state.data.length === 0) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <HeaderComponent
              title="Score Board"
              navAction="back"
              nav={this.props.navigation}
            />
            <Text style={styles.text}>{courseName} - No Score Board</Text>
            {role === 'Admin' || role === 'Counsellor' ? null : (
              <TouchableOpacity
                onPress={this.handleroute}
                style={{
                  backgroundColor: '#27a7e2',
                  alignSelf: 'center',
                  marginTop: hp(5),
                  width: hp(15),
                  height: hp(15),
                  borderRadius: wp(35), // Set borderRadius to 50% for a circular shape
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: wp(5),
                    marginRight: wp(2),
                  }}>
                  Start
                </Text>
                <View>
                  <Image
                    source={require('../../assets/icons/right-arrow.png')}
                    style={{
                      aspectRatio: 1 / 1,
                      height: hp(2),
                    }}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      );
    }
    const iconMapping = {
      1: require('../../assets/icons/firstRank.png'),
      2: require('../../assets/icons/seconRank.png'),
      3: require('../../assets/icons/thirdRank.png'),
    };
    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title="Score Board"
              navAction="back"
              nav={this.props.navigation}
            />
            <View>
              <View style={{borderBottomWidth: 1}}>
                <Text style={styles.text}>{courseName} - Score Board</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: hp(1),
                }}>
                <View>
                  <Text>Rank</Text>
                </View>
                <View style={{width: wp('25%')}}>
                  <Text>Name</Text>
                </View>
                <View>
                  <Text>Attempt</Text>
                </View>
                <View>
                  <Text>Score</Text>
                </View>
              </View>
              <View style={{margin: hp(1), marginTop: wp(5)}}>
                {this.state.data.map((rowData, index) => (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                        // alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: hp(5),
                      }}
                      key={index}>
                      {index < 3 && iconMapping[index + 1] && (
                        <Image
                          source={iconMapping[index + 1]}
                          style={{
                            // aspectRatio: 1 / 1,
                            height: hp(4),
                            maxWidth: wp(10),
                            resizeMode: 'contain',
                            marginRight: wp(3),
                          }}
                        />
                      )}
                      {index >= 3 && (
                        <Text
                          style={{
                            marginRight: wp(3),
                            marginLeft: wp(3),
                            // aspectRatio: 1 / 1,
                            width: wp(5),
                            fontWeight: 'bold',
                            marginTop: wp(1.5),
                          }}>
                          {index + 1}
                        </Text>
                      )}
                      <View
                        style={{
                          flexDirection: 'row',
                          width: wp('30%'),
                          marginLeft: wp(-20),
                        }}>
                        <View
                          style={{
                            marginRight: wp(3),
                            borderRadius: wp(5),
                            overflow: 'hidden',
                          }}>
                          <Image
                            source={{uri: rowData.avtar}}
                            style={{
                              // aspectRatio: 1 / 1,
                              // width: hp(8),
                              height: hp(5),
                              width: wp(10),
                              resizeMode: 'contain',
                            }}
                          />
                        </View>
                        <View>
                          <Text style={{fontWeight: 'bold'}}>
                            {rowData.studentName}
                          </Text>
                          <Text style={{fontSize: wp(2.5)}}>
                            ({rowData.branch})
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          marginLeft: wp(-5),
                          justifyContent: 'center',
                          marginTop: wp(-2),
                        }}>
                        <Text>{rowData.attempt}</Text>
                      </View>

                      <View
                        style={{justifyContent: 'center', marginTop: wp(-2)}}>
                        <Text>{rowData.totalAverage}</Text>
                      </View>
                    </View>
                  </>
                ))}
                {role === 'Admin' || role === 'Counsellor' ? null : (
                  <TouchableOpacity
                    onPress={this.handleroute}
                    style={{
                      backgroundColor: '#27a7e2',
                      alignSelf: 'center',
                      marginTop: hp(5),
                      width: hp(15),
                      height: hp(15),
                      // paddingVertical: hp(2),
                      // paddingHorizontal: wp(10),
                      borderRadius: wp(35), // Set borderRadius to 50% for a circular shape
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#fff',
                        fontSize: wp(5),
                        marginRight: wp(2),
                      }}>
                      Start
                    </Text>
                    <View>
                      <Image
                        source={require('../../assets/icons/right-arrow.png')}
                        style={{
                          aspectRatio: 1 / 1,
                          height: hp(2),
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        )}

        {this.state.connectionState === false && (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        )}
        {/* <FooterComponent nav={this.props.navigation} tab="Quiz" /> */}
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
  listContentContainer: {
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
  text: {
    fontSize: wp(5),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: wp(3),
    marginBottom: hp(3),
  },
  table: {
    borderTopWidth: 1,
    borderColor: '#000',
    marginTop: wp(10),
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#000',
  },
  tableRow2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#000',
  },
  tableCell: {
    flex: 1,
    padding: 8,

    //     borderRightWidth: 1,
    //     borderRightColor: '#000',
  },
  tableCell2: {
    flex: 1,
    padding: 8,
    backgroundColor: '#1d99d2',
    marginTop: wp(1.5),
    //     borderRightWidth: 1,
    //     borderRightColor: '#000',
  },
});
