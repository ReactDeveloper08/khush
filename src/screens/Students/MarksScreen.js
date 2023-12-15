import React, {Component} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import HeaderComponent from '../../components/HeaderComponent';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {KEYS, getData} from '../../api/UserPreference';
import NetInfo from '@react-native-community/netinfo';
import CustomLoader from '../../components/CustomLoader';
import offline from '../../assets/icons/internetConnectionState.gif';

export default class MarksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectionState: true,
      data: [],
      showProcessingLoader: false,
      status: '',
    };
  }
  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchQuiz();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchQuiz = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      const {s_id} = userInfo;
      this.setState({isLoading: true});

      const params = {
        student_id: s_id,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'getStudentAllQuizResult',
        params,
        true,
      );
      console.log('rerea', response);
      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {data} = response;

          this.setState({
            data: data,
            status: null,
            isLoading: false,
            isRefreshing: false,
          });
        } else {
          const {message} = response;
          this.setState({
            status: message,
            quiz: null,
            isLoading: false,
            isRefreshing: false,
          });
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    // Assumin
    const {data, status} = this.state;
    return (
      <>
        <HeaderComponent
          title="Marks Report"
          navAction="back"
          nav={this.props.navigation}
        />
        <View style={{flex: 1}}>
          <View
            style={{
              marginTop: wp(3),
              marginBottom: wp(2),
              borderBottomWidth: 1,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: wp(5),
                fontWeight: 'bold',
                color: '#000',
                marginBottom: wp(5),
              }}>
              Marks Report
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // margin: hp(1),
            }}>
            <View style={{width: '30%'}}>
              <Text style={{textAlign: 'center'}}>Date</Text>
            </View>
            <View style={{width: '40%'}}>
              <Text style={{textAlign: 'center'}}>Course Name</Text>
            </View>
            {/* <View style={{width: wp('15%')}}>
              <Text style={{textAlign: 'center'}}>Marks</Text>
            </View> */}
            <View style={{width: '30%'}}>
              <Text style={{textAlign: 'center'}}>Obtained</Text>
            </View>
          </View>
          {data.length > 0 ? (
            <View>
              {data.map((rowData, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: hp(1),
                  }}>
                  <View style={{width: '30%'}}>
                    <Text style={{textAlign: 'center'}}>
                      {rowData.quiz_date}
                    </Text>
                  </View>
                  <View style={{width: '40%'}}>
                    <Text style={{textAlign: 'center'}}>{rowData.course}</Text>
                  </View>
                  {/* <View style={{width: wp('15%')}}>
                  <Text style={{textAlign: 'center'}}>
                    {rowData.total_marks}
                  </Text>
                </View> */}
                  <View style={{width: '30%'}}>
                    <Text style={{textAlign: 'center'}}>
                      {rowData.total_marks}/{rowData.obtain_marks}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={{marginTop: hp(20)}}>
              <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                {status}
              </Text>
            </View>
          )}
          {this.state.connectionState === false && (
            <View style={styles.offlineStyle}>
              <Image source={offline} style={styles.networkIssue} />
            </View>
          )}
        </View>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ececec',
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
});
