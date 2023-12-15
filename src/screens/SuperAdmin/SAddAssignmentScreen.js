import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Keyboard,
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
import PickerModal from 'react-native-picker-modal-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../../api/UserPreference';
import basicStyles from '../../styles/BasicStyles';

export default class HrAddAssignmentScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isProcessing: false,

      batchData: [],
      selectedBatchData: {
        Id: 0,
        Name: 'All Batch',
        Value: 'All Batch',
      },

      facultyData: [],
      selectedFaculty: {
        Id: 0,
        Name: 'All Faculty',
        Value: 'All Faculty',
      },

      branchData: [],
      selectedBranch: {
        Id: 0,
        Name: 'All Branch',
        Value: 'All Branch',
      },

      message: '',
      title: '',
      showImagePopup: false,
      status: null,
      isRefreshing: false,
      selectedMinDate: null,
      isVisible: false,
      selectedDate: 'Select Date',
    };
  }

  componentDidMount() {
    // this.fetchBranches();
    this.fetchFaculty();
    this.fetchBatches();
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
              Id: id,
              Name: name,
              Value: name,
            };

            return data;
          });

          this.setState({branchData, isLoading: false});
        } else {
          const {message} = response;

          this.setState({
            branchData: [],
            status: message,
            isLoading: false,
            isRefreshing: false,
          });
        }
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
              Id: id,
              Name: name,
              Value: name,
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
          batchData: [],
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
    const {selectedFaculty} = this.state;
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      const {branchId} = userInfo;

      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        branchId,
        facultyId: selectedFaculty.Id,
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
              Id: batchId,
              Name: name,
              Value: name,
            };

            return data;
          });

          this.setState({
            batchData,
            isLoading: false,
            selectedBatchData: {
              Id: 0,
              Name: 'All Batch',
              Value: 'All Batch',
            },
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

  renderBatchView = (disabled, selected, showModal) => {
    const {selectedBatchData} = this.state;
    const {Name} = selectedBatchData;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Name === 'All Batch') {
      labelStyle.color = '#666';
    }

    const handlePress = disabled ? null : showModal;

    return (
      <View style={[styles.inputContainer]}>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          <Text style={labelStyle}>{Name}</Text>
          {/* <Image source={ic_down} resizeMode="cover" style={styles.downIcon} /> */}
        </TouchableOpacity>
      </View>
    );
  };

  handleSelectedBatchData = selectedBatchData => {
    this.setState({selectedBatchData});
    return selectedBatchData;
  };

  handleSelectedBatchDataClose = () => {
    const {selectedBatchData} = this.state;
    this.setState({selectedBatchData});
  };

  renderMessageView = (disabled, selected, showModal) => {
    const {selectedBatchType} = this.state;
    const {Value} = selectedBatchType;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Value === 'Select Message') {
      labelStyle.color = '#777';
    }

    const handlePress = disabled ? null : showModal;

    return (
      <View style={[styles.inputContainer]}>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          <Text style={labelStyle}>{Value}</Text>
          {/* <Image source={ic_down} resizeMode="cover" style={styles.downIcon} /> */}
        </TouchableOpacity>
      </View>
    );
  };

  handleMessageSelect = selectedBatchType => {
    const {Name, Value} = selectedBatchType;
    this.setState({selectedBatchType, message: Name, title: Value});
    return selectedBatchType;
  };

  handleMessageSelectClose = () => {
    const {selectedBatchType} = this.state;
    this.setState({selectedBatchType});
  };

  handleAddAssignment = async () => {
    const {title, message, selectedBatchData, selectedDate, selectedBranch} =
      this.state;

    if (title.trim() === '') {
      Alert.alert('', 'Enter Title');
      return;
    }
    if (message.trim() === '') {
      Alert.alert('', 'Enter Message');
      return;
    }

    Keyboard.dismiss();

    const userInfo = await getData(KEYS.USER_INFO);

    const {branchId} = userInfo;

    try {
      // starting loader
      this.setState({isProcessing: true});

      // preparing params
      const params = {
        title,
        description: message,
        batchId: selectedBatchData.Id,
        branchId,
        givenDate: selectedDate,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'addAssignment',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success, message: toastMessage} = response;

        if (success) {
          this.setState({
            isProcessing: false,
            selectedBranch: {
              Id: '',
              Name: 'All Branch',
              Value: 'All Branch',
            },
            selectedBatchData: {
              Id: '',
              Name: 'All Batch',
              Value: 'All Batch',
            },
            selectedFaculty: {
              Id: '',
              Name: 'All Faculty',
              Value: 'All Faculty',
            },
            selectedTemplateMessage: {
              Id: -1,
              Name: 'Select Template',
              Value: 'Select Template',
            },
            message: '',
            title: '',
          });
          const {pop, getParam} = this.props.navigation;
          const fetchAssignments = await getParam('fetchAssignment', null);

          showToast(toastMessage);

          await fetchAssignments();

          pop();
        } else {
          this.setState({
            status: message,
            isProcessing: false,
          });
        }
        // }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  renderFacultyView = (disabled, selected, showModal) => {
    const {selectedFaculty} = this.state;
    const {Value} = selectedFaculty;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Value === 'All Faculty') {
      labelStyle.color = '#777';
    }

    const handlePress = disabled ? null : showModal;

    return (
      <View style={[styles.inputContainer]}>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          <Text style={labelStyle}>{Value}</Text>
          {/* <Image source={ic_down} resizeMode="cover" style={styles.downIcon} /> */}
        </TouchableOpacity>
      </View>
    );
  };

  handleFacultySelect = selectedFaculty => {
    this.setState({selectedFaculty}, () => {
      this.fetchBatches();
    });
    return selectedFaculty;
  };

  handleFacultySelectClose = () => {
    const {selectedFaculty} = this.state;
    this.setState({selectedFaculty});
  };

  renderBranchView = (disabled, selected, showModal) => {
    const {selectedBranch} = this.state;
    const {Value} = selectedBranch;

    const labelStyle = {
      color: '#000',
      fontSize: wp(3),
    };

    if (Value === 'All Branch') {
      labelStyle.color = '#777';
    }

    const handlePress = disabled ? null : showModal;

    return (
      <View style={[styles.inputContainer]}>
        <TouchableOpacity
          underlayColor="transparent"
          onPress={handlePress}
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.justifyBetween,
          ]}>
          <Text style={labelStyle}>{Value}</Text>
          {/* <Image source={ic_down} resizeMode="cover" style={styles.downIcon} /> */}
        </TouchableOpacity>
      </View>
    );
  };

  handleBranchSelect = selectedBranch => {
    this.setState({selectedBranch});
    return selectedBranch;
  };

  handleBranchSelectClose = () => {
    const {selectedBranch} = this.state;
    this.setState({selectedBranch});
  };

  renderItem = ({item}) => {
    const backgroundColor =
      '#' +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
      55;
    return (
      <MarkAssignmentComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
      />
    );
  };
  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  showPicker = () => {
    this.setState({
      isVisible: true,
    });
  };

  hidePicker = () => {
    this.setState({
      isVisible: false,
    });
  };

  handlePickerConfirm = dateObj => {
    const date = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const selectedDate = `${date}-${month}-${year}`;

    this.setState({selectedDate, isVisible: false});
  };

  handleTitleChange = changedText => {
    this.setState({
      title: changedText,
    });
  };

  handleMessageChange = changedText => {
    this.setState({
      message: changedText,
    });
  };

  render() {
    const {isLoading, isProcessing} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {
      studentList,
      isRefreshing,
      isVisible,
      selectedDate,
      selectedMinDate,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <HeaderComponent
            title="Add Assignment"
            nav={this.props.navigation}
            navAction="back"
          />
        </View>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.marginTopHalf,
            basicStyles.justifyEvenly,
          ]}>
          <View style={styles.fromDateFieldContainer}>
            <PickerModal
              items={this.state.facultyData}
              requireSelection={true}
              selected={this.state.selectedFaculty}
              onSelected={this.handleFacultySelect}
              onClosed={this.handleFacultySelectClose}
              // backButtonDisabled
              showToTopButton={true}
              showAlphabeticalIndex={true}
              autoGenerateAlphabeticalIndex={false}
              searchPlaceholderText="Search"
              renderSelectView={this.renderFacultyView}
            />
          </View>
          <View style={styles.fromDateFieldContainer}>
            <PickerModal
              items={this.state.batchData}
              requireSelection={true}
              selected={this.state.selectedBatchData}
              onSelected={this.handleSelectedBatchData}
              onClosed={this.handleSelectedBatchDataClose}
              // backButtonDisabled
              showToTopButton={true}
              showAlphabeticalIndex={true}
              autoGenerateAlphabeticalIndex={false}
              searchPlaceholderText="Search"
              renderSelectView={this.renderBatchView}
            />
          </View>
        </View>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            basicStyles.marginTopHalf,
            basicStyles.justifyEvenly,
          ]}>
          {/* <View style={styles.fromDateFieldContainer}>
            <PickerModal
              items={this.state.branchData}
              requireSelection={true}
              selected={this.state.selectedBranch}
              onSelected={this.handleBranchSelect}
              onClosed={this.handleBranchSelectClose}
              // backButtonDisabled
              showToTopButton={true}
              showAlphabeticalIndex={true}
              autoGenerateAlphabeticalIndex={false}
              searchPlaceholderText="Search"
              renderSelectView={this.renderBranchView}
            />
          </View> */}

          <View style={styles.fromDateFieldContainer}>
            <TouchableOpacity
              underlayColor="transparent"
              onPress={this.showPicker}>
              <View style={styles.dateButtonContainer}>
                <Text style={styles.selectedDate}>
                  {this.state.selectedDate}
                </Text>
              </View>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isVisible}
              mode="date"
              maximumDate={new Date()}
              minimumDate={
                new Date(new Date().setDate(new Date().getDate() - 7))
              }
              onConfirm={this.handlePickerConfirm}
              onCancel={this.hidePicker}
            />
          </View>
        </View>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            {marginTop: wp(1), marginLeft: wp(6.5)},
          ]}>
          <TextInput
            placeholder="Title"
            placeholderTextColor="#666"
            style={styles.loginFormTextInput}
            value={this.state.title}
            onChangeText={this.handleTitleChange}
          />
        </View>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            {marginTop: wp(1), marginLeft: wp(6.5)},
          ]}>
          <TextInput
            placeholder="Description"
            placeholderTextColor="#666"
            style={styles.loginFormTextArea}
            value={this.state.message}
            multiline={true}
            numberOfLines={6}
            onChangeText={this.handleMessageChange}
          />
        </View>

        {/* <View style={[basicStyles.marginBottom, basicStyles.flexOne]}>
          <Text style={styles.textStyle}>Students List</Text>

          <View
            style={[
              styles.infoContainer,
              // basicStyles.paddingHalfHorizontal,
            ]}>
            <Text style={[styles.serialText]}>Enroll No</Text>
            <Text
              style={[
                styles.midText2,
                {flex: 1.3, textAlign: 'left', paddingLeft: wp(10)},
              ]}>
              Student
            </Text>
            <Text style={[styles.midText2, {flex: 0.4, textAlign: 'left'}]}>
              Date
            </Text>
            <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
              Grade
            </Text>
          </View>
          <View style={basicStyles.flexOne}>
            <FlatList
              data={studentList}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContentContainer}
              refreshing={isRefreshing}
              onRefresh={this.handleListRefresh}
            />
          </View>
        </View> */}
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={this.handleAddAssignment}>
          <Text style={styles.buttonText3}>Add Assignment</Text>
        </TouchableOpacity>

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
    width: wp(87),
    fontSize: wp(3),
    borderWidth: 0.8,
    borderColor: '#999',
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
    paddingLeft: wp(2),
    marginTop: wp(4),
    height: hp(10),
    width: wp(87),
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
    width: wp(14),
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
});
