import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
// Components
import HeaderComponent from '../../components/HeaderComponent';
import showToast from '../../components/CustomToast';
import SAssignmentsComponent from '../../components/SuperAdmin/SAssignmentsComponent';
import CustomLoader from '../../components/CustomLoader';
import ModalSelector from 'react-native-modal-selector';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../../api/UserPreference';
import basicStyles from '../../styles/BasicStyles';

// Icons
import ic_add from '../../assets/icons/ic_add.png';

export default class SAssignmentsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      assignmentData: null,
      connectionState: true,
      batchData: [],
      selectedBatchData: {
        key: '',
        label: 'All Batch',
      },

      facultyData: [],
      selectedFaculty: {
        key: '',
        label: 'All Faculty',
      },

      branchData: [],
      selectedBranch: {
        key: '',
        label: 'All Branch',
      },

      showImagePopup: false,
      status: null,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchAssignments();
    this.fetchBranches();
    this.fetchFaculty();
    this.fetchBatches();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  fetchBranches = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // calling api
      const response = await makeRequest(BASE_URL + 'getBranch', null, true);

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

          this.setState({branchData, isLoading: false, isRefreshing: false});
        } else {
          const {message} = response;

          this.setState({
            branchData: [],
            status: message,
            isLoading: false,
            isRefreshing: false,
          });
        }
      } else {
        this.setState({
          branchData: [],
          status: '',
          isLoading: false,
          isRefreshing: false,
        });

        showToast('Network Request Error');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchFaculty = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // calling api
      const response = await makeRequest(BASE_URL + 'getFaculty', null, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {faculty} = response;

          const facultyData = faculty.map(item => {
            const {id, name} = item;
            let data = {
              key: id,
              label: name,
            };

            return data;
          });

          this.setState({facultyData, isLoading: false});
        } else {
          const {message} = response;

          this.setState({
            facultyData: [],
            status: message,
            isLoading: false,
            isRefreshing: false,
          });
        }
      } else {
        this.setState({
          facultyData: [],
          status: '',
          isLoading: false,
          isRefreshing: false,
        });

        showToast('Network Request Error');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchBatches = async () => {
    const {selectedFaculty, selectedBranch} = this.state;
    try {
      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        branchId: selectedBranch.key,
        facultyId: selectedFaculty.key,
      };

      // calling api
      const response = await makeRequest(BASE_URL + 'getBatch', params, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {batchDetails} = response;

          const batchData = batchDetails.map(item => {
            const {batchId, name} = item;
            let data = {
              key: batchId,
              label: name,
            };

            return data;
          });

          this.setState({
            batchData,
            isLoading: false,
            isRefreshing: false,
          });
        } else {
          const {message} = response;

          this.setState({
            batchData: [],
            status: message,
            isLoading: false,
            isRefreshing: false,
          });
        }
      } else {
        this.setState({
          batchData: [],
          status: '',
          isLoading: false,
          isRefreshing: false,
        });

        showToast('Network Request Error');
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        isRefreshing: false,
      });
      console.log(error.message);
    }
  };

  fetchAssignments = async () => {
    const {selectedFaculty, selectedBatchData, selectedBranch} = this.state;
    try {
      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        facultyId: selectedFaculty.key,
        branchId: selectedBranch.key,
        batchId: selectedBatchData.key,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'getAssignment',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {assignmentDetails} = response;
          this.setState({
            assignmentData: assignmentDetails,
            status: null,
            isLoading: false,
            isRefreshing: false,
          });
        } else {
          const {message} = response;

          this.setState({
            status: message,
            assignmentData: null,
            isLoading: false,
            isRefreshing: false,
          });
        }
        // }
      } else {
        this.setState({
          assignmentData: null,
          isLoading: false,
          isRefreshing: false,
        });

        showToast('Network Request Error');
      }
    } catch (error) {
      console.log(error.message);
    }
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

  handleBatchSelect = selectedBatchData => {
    this.setState({selectedBatchData}, () => {
      this.fetchAssignments();
    });
  };

  handleFacultySelect = selectedFaculty => {
    this.setState({selectedFaculty}, async () => {
      await this.fetchAssignments();
      this.fetchBatches();
    });
  };

  handleBranchSelect = selectedBranch => {
    this.setState({selectedBranch}, async () => {
      await this.fetchBatches();
      this.fetchAssignments();
    });
  };

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <SAssignmentsComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
      />
    );
  };
  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleAddAssignment = () => {
    this.props.navigation.navigate('HrAddAssignment');
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {
      assignmentData,
      status,
      isRefreshing,
      branchData,
      facultyData,
      batchData,
      messageData,
      selectedBranch,
      selectedBatchData,
      selectedFaculty,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        {this.state.connectionState && (
          <>
            <View style={styles.headerContainer}>
              <HeaderComponent
                title="Assignments"
                nav={this.props.navigation}
              />
            </View>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.marginTopHalf,
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
                  <Text style={[styles.initialTextStyle, {paddingLeft: wp(2)}]}>
                    {selectedBranch.label}
                  </Text>
                </View>
              </ModalSelector>

              <ModalSelector
                data={facultyData}
                initValue="Select Faculty"
                cancelText="Cancel"
                animationType="fade"
                backdropPressToClose={true}
                onChange={this.handleFacultySelect}
                style={styles.pickerStyle}
                initValueTextStyle={styles.initialTextStyle}
                selectTextStyle={styles.selectedTextStyle}
                optionTextStyle={styles.optionTextStyle}>
                <View style={[styles.customPickerStyle, {marginLeft: wp(-1)}]}>
                  <Text style={[styles.initialTextStyle, {paddingLeft: wp(2)}]}>
                    {selectedFaculty.label}
                  </Text>
                </View>
              </ModalSelector>
            </View>

            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                basicStyles.marginTopHalf,
                basicStyles.justifyEvenly,
              ]}>
              <ModalSelector
                data={batchData}
                initValue="Select Batch"
                cancelText="Cancel"
                animationType="fade"
                backdropPressToClose={true}
                onChange={this.handleBatchSelect}
                // style={styles.pickerStyle}
                initValueTextStyle={styles.initialTextStyle}
                selectTextStyle={styles.selectedTextStyle}
                optionTextStyle={styles.optionTextStyle}>
                <View style={[styles.customPickerStyle, {width: wp(85)}]}>
                  <Text style={[styles.initialTextStyle, {paddingLeft: wp(2)}]}>
                    {selectedBatchData.label}
                  </Text>
                </View>
              </ModalSelector>
            </View>

            <View style={[basicStyles.flexOne]}>
              <Text style={styles.textStyle}>Assignments List </Text>
              {assignmentData ? (
                <FlatList
                  data={assignmentData}
                  renderItem={this.renderItem}
                  keyExtractor={this.keyExtractor}
                  ItemSeparatorComponent={this.itemSeparator}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.listContentContainer}
                  refreshing={isRefreshing}
                  onRefresh={this.handleListRefresh}
                />
              ) : (
                <View style={styles.messageContainer}>
                  <Text style={styles.messageText}>No Data Found...</Text>
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

  // Picker Style
  customPickerStyle: {
    width: wp(40),
    height: wp(11),
    borderWidth: 0.8,
    borderColor: '#999',
    borderRadius: wp(1),
    justifyContent: 'center',
    // borderRadius: 1,
    margin: wp(2),
  },
  pickerStyle: {
    width: wp(40),
    // height: wp(12),
    margin: wp(2),
  },

  templatePickerStyle: {
    width: wp(35),
    // borderRadius: 1,
    margin: wp(2),
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
