import React, {Component} from 'react';
import {View, Text, FlatList, StyleSheet, TextInput, Image} from 'react-native';
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
import FooterComponent from '../../components/FooterComponent';
import HrStudentSummaryComponent from '../../components/HrAdmin/HrStudentSummaryComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';
import {KEYS, getData} from '../../api/UserPreference';

export default class HrStudentsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      studentsList: null,
      studentName: '',
      studentEnroll: '',
      isLoading: false,
      connectionState: true,
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchStudentList();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchStudentList = async () => {
    const {studentName, studentEnroll} = this.state;
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      const {branchId} = userInfo;

      // starting loader
      this.setState({isLoading: true});

      const params = {
        branchId: branchId,
        studentName,
        studentEnroll,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'getStudentList',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {students, totalStudents} = response; // Assuming the API response includes totalStudents

          this.setState({
            studentsList: students,
            totalStudents: totalStudents, // Save the total students in state
            status: null,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message} = response;

          this.setState({
            status: message,
            studentsList: null,
            totalStudents: 0,
            isLoading: false,
            isListRefreshing: false,
          });
        }
      } else {
        this.setState({
          status: 'No Data Found',
          studentsList: null,
          totalStudents: 0,
          isLoading: false,
          isListRefreshing: false,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderItem = ({item, index}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;

    return (
      <HrStudentSummaryComponent
        item={item}
        nav={this.props.navigation}
        itemIndex={index}
        backgroundColor={backgroundColor}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  onEnrollChange = changedText => {
    this.setState({studentEnroll: changedText}, () => {
      this.fetchStudentList();
    });
  };

  onNameChange = changedText => {
    this.setState({studentName: changedText}, () => {
      this.fetchStudentList();
    });
  };
  handleListRefresh = async () => {
    try {
      // pull-to-refresh
      this.setState({isListRefreshing: true});

      // updating list
      await this.fetchStudentList();
    } catch (error) {
      console.log(error.message);
    }
  };
  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }

    const {studentsList, totalStudents} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Students" nav={this.props.navigation} />
            <View style={styles.mainContainer}>
              <Text style={styles.searchText}>Search Student </Text>

              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  basicStyles.marginTop,
                  basicStyles.marginLeft,
                ]}>
                <TextInput
                  placeholder="Enroll No."
                  placeholderTextColor="#666"
                  style={styles.enrollTextInput}
                  value={this.state.studentEnroll}
                  onChangeText={this.onEnrollChange}
                  maxLength={6}
                />

                <TextInput
                  placeholder="Student Name"
                  placeholderTextColor="#666"
                  style={styles.sNameTextInput}
                  value={this.state.studentName}
                  onChangeText={this.onNameChange}
                />
              </View>

              {studentsList ? (
                <View style={basicStyles.flexOne}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.textStyle}>Students List</Text>
                    <Text
                      style={{
                        padding: wp(4),
                        fontSize: wp(4),
                        fontWeight: '500',
                      }}>
                      Total : {totalStudents}
                    </Text>
                  </View>
                  <FlatList
                    data={studentsList}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    ItemSeparatorComponent={this.itemSeparator}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.notesListContent}
                    refreshing={this.state.isListRefreshing}
                    onRefresh={this.handleListRefresh}
                  />
                </View>
              ) : (
                <View style={basicStyles.noDataStyle}>
                  <Text style={basicStyles.noDataTextStyle}>No Data Found</Text>
                </View>
              )}
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
    paddingBottom: hp(2),
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    // borderBottomWidth: 1.5,
    borderColor: '#999',
  },
  searchText: {
    padding: wp(3),
    fontSize: wp(4.8),
    fontWeight: '700',
    marginBottom: wp(-4),
  },
  enrollTextInput: {
    height: hp(5),
    width: wp(30),
    fontSize: wp(3),
    borderWidth: 0.9,
    borderColor: '#666',
    textAlignVertical: 'top',
    borderRadius: wp(1),
    paddingLeft: wp(2),
    marginHorizontal: wp(2),
  },
  sNameTextInput: {
    height: hp(5),
    width: wp(55),
    fontSize: wp(3),
    borderWidth: 0.9,
    borderColor: '#666',
    textAlignVertical: 'top',
    borderRadius: wp(1),
    paddingLeft: wp(2),
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
