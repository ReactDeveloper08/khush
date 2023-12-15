import React, {Component} from 'react';
import {View, Text, FlatList, StyleSheet, TextInput, Image} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ModalSelector from 'react-native-modal-selector';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import FooterComponent from '../../components/FooterComponent';
import StudentSummaryComponent from '../../components/SuperAdmin/StudentSummaryComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Styles
import basicStyles from '../../styles/BasicStyles';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
import StudentSummaryComponent2 from '../../components/SuperAdmin/StudentSummaryComponent2';

export default class SearchStudent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      branchData: [],
      selectedBranch: {
        key: '',
        label: 'All Branch',
      },
      studentsList: null,
      studentName: '',
      studentEnroll: '',
      isLoading: true,
      connectionState: true,
      isListRefreshing: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchStudentList();
    this.fetchBranches();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchStudentList = async () => {
    const {studentName, studentEnroll, selectedBranch} = this.state;
    try {
      // starting loader
      // this.setState({isLoading: true});

      const params = {
        branchId: selectedBranch.key,
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
          isLoading: false,
          isListRefreshing: false,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchBranches = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // calling api
      const response = await makeRequest(BASE_URL + 'getBranch', null, true);
      console.log('++', response);
      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {branch} = response;

          const branchData = branch.map(item => {
            const {id, name} = item;
            let data = {
              key: id,
              label: name,
            };

            return data;
          });

          this.setState({
            branchData,
            isLoading: false,
            isListRefreshing: false,
          });
        } else {
          const {message} = response;

          this.setState({
            branchData: [],
            status: message,
            isLoading: false,
            isListRefreshing: false,
          });
        }
      } else {
        this.setState({
          branchData: [],
          isLoading: false,
          isListRefreshing: false,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleBranchSelect = selectedBranch => {
    this.setState({selectedBranch}, () => {
      this.fetchStudentList();
    });
  };

  renderItem = ({item, index}) => {
    return (
      <StudentSummaryComponent2
        item={item}
        itemIndex={index}
        nav={this.props.navigation}
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
      await this.fetchBranches();
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {studentsList, branchData, selectedBranch, totalStudents} =
      this.state;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title="Search Students"
              nav={this.props.navigation}
            />
            <View style={styles.mainContainer}>
              <Text style={styles.searchText}>Search Student</Text>

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
              <View
                style={[
                  basicStyles.directionRow,
                  basicStyles.alignCenter,
                  // basicStyles.marginLeft,
                  basicStyles.justifyEvenly,
                ]}>
                <ModalSelector
                  data={branchData}
                  initValue="Select Branch"
                  cancelText="Cancel"
                  animationType="fade"
                  backdropPressToClose={true}
                  onChange={this.handleBranchSelect}
                  // style={styles.pickerStyle}
                  initValueTextStyle={styles.initialTextStyle}
                  selectTextStyle={styles.selectedTextStyle}
                  optionTextStyle={styles.optionTextStyle}>
                  <View style={[styles.customPickerStyle]}>
                    <Text
                      style={[styles.initialTextStyle, {paddingLeft: wp(2)}]}>
                      {selectedBranch.label}
                    </Text>
                  </View>
                </ModalSelector>
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
                        fontWeight: 'bold',
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
    paddingBottom: hp(16),
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomWidth: 1.5,
    borderColor: '#999',
  },
  searchText: {
    padding: wp(3),
    fontSize: wp(4.8),
    fontWeight: '700',
    marginBottom: wp(-4),
  },

  // Picker Style
  customPickerStyle: {
    width: wp(86.5),
    height: wp(11),
    borderWidth: 0.8,
    borderColor: '#999',
    borderRadius: wp(1),
    justifyContent: 'center',
    // borderRadius: 1,
    marginTop: wp(4),
  },
  initialTextStyle: {
    color: '#666',
    fontSize: wp(3),
    // marginLeft: wp(2),
    marginVertical: wp(1.33),
    textAlign: 'left',
  },

  optionTextStyle: {
    color: '#111',
  },

  selectedTextStyle: {
    textAlign: 'left',
    color: '#111',
    fontSize: wp(3),
    marginLeft: wp(2),
    marginVertical: wp(1.33),
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
