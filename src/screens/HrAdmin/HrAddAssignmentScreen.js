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
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';

import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

// Components
import HeaderComponent from '../../components/HeaderComponent';
import MarkAssignmentComponent from '../../components/HrAdmin/MarkAssignmentComponent';
import CustomLoader from '../../components/CustomLoader';
import ProcessingLoader from '../../components/ProcessingLoader';
import showToast from '../../components/CustomToast';
import ModalSelector from 'react-native-modal-selector';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DocumentPicker from 'react-native-document-picker';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

// User Preference
import {KEYS, getData, clearData} from '../../api/UserPreference';
import basicStyles from '../../styles/BasicStyles';

export default class HrAddAssignmentScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isProcessing: false,

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
      selectedFile: null,
      imageName: 'Upload File',
    };
  }

  componentDidMount() {
    this.fetchFaculty();
    this.fetchBatches();
    this.checkPermission();
  }

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
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchBatches = async () => {
    const {selectedFaculty, selectedBranch} = this.state;
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      const {branchId} = userInfo;

      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        facultyId: selectedFaculty.key,
        branchId: branchId,
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
            selectedBatchData: {
              key: '',
              label: 'All Batch',
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
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  checkPermission = async () => {
    try {
      const platformPermission = Platform.select({
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      });

      const result = await check(platformPermission);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          // console.log(
          // 'The permission has not been requested / is denied but requestable',
          // );
          const requestResult = await request(platformPermission);
          switch (requestResult) {
            case RESULTS.GRANTED:
            // this.handleImagePick();
          }
          break;
        case RESULTS.GRANTED:
          // console.log("The permission is granted");
          // this.handleImagePick();
          break;
        case RESULTS.BLOCKED:
          // console.log('The permission is denied and not requestable anymore');
          Alert.alert(
            'Permission Blocked',
            'Press OK and provide "Storage" permission in App Setting',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: this.handleOpenSettings,
              },
            ],
            {cancelable: false},
          );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleOpenSettings = async () => {
    try {
      await openSettings();
    } catch (error) {
      console.log('cannot open settings', error);
    }
  };

  handleFilePick = async () => {
    try {
      // Pick a single file
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const {name, size} = response;
      const fileSizeMB = size / (1024 * 1024); // Convert size to MB
      const extension = name.split('.').pop();
      const isFileAllowed =
        extension === 'pdf' ||
        extension === 'jpeg' ||
        extension === 'doc' ||
        extension === 'docx' ||
        extension === 'jpg' ||
        extension === 'png';

      if (isFileAllowed) {
        if (fileSizeMB <= 2) {
          this.setState({selectedFile: response, imageName: name});
        } else {
          alert('File size exceeds 2MB. Please select a smaller file.');
        }
      } else {
        alert(`.${extension} file not allowed`);
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
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

  handleTokenExpire = async () => {
    await clearData();
    this.props.navigation.navigate('LoggedOut');
  };

  handleAddAssignment = async () => {
    const {title, message, selectedBatchData, selectedDate, selectedFile} =
      this.state;

    if (selectedBatchData.key === '') {
      Alert.alert('Alert!', 'Select Batch');
      return;
    }
    if (selectedDate === 'Select Date') {
      Alert.alert('Alert!', 'Select Date');
      return;
    }

    if (title.trim() === '') {
      Alert.alert('Alert!', 'Enter Title');
      return;
    }
    if (message.trim() === '') {
      Alert.alert('Alert!', 'Enter Description');
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
        batchId: selectedBatchData.key,
        branchId,
        givenDate: selectedDate,
        document: selectedFile,
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
          const {pop, getParam} = this.props.navigation;
          const fetchAssignments = await getParam('fetchAssignment', null);

          showToast(toastMessage);

          await fetchAssignments();

          pop();

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
        } else {
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
            isProcessing: false,
          });
        }
      } else {
        this.setState({
          status: message,
          isProcessing: false,
        });

        showToast('Network Request Error');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleBatchSelect = selectedBatchData => {
    this.setState({selectedBatchData});
  };

  handleFacultySelect = selectedFaculty => {
    this.setState({selectedFaculty}, () => {
      this.fetchBatches();
    });
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
      facultyData,
      batchData,
      selectedBatchData,
      selectedFaculty,
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <HeaderComponent
            title="Add Assignment "
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
            <View style={[styles.customPickerStyle]}>
              <Text style={[styles.initialTextStyle, {paddingLeft: wp(2)}]}>
                {selectedFaculty.label}
              </Text>
            </View>
          </ModalSelector>

          <ModalSelector
            data={batchData}
            initValue="Select Batch"
            cancelText="Cancel"
            animationType="fade"
            backdropPressToClose={true}
            onChange={this.handleBatchSelect}
            style={styles.pickerStyle}
            initValueTextStyle={styles.initialTextStyle}
            selectTextStyle={styles.selectedTextStyle}
            optionTextStyle={styles.optionTextStyle}
          />
        </View>

        <View
          style={[
            basicStyles.directionRow,
            basicStyles.alignCenter,
            // basicStyles.marginTopHalf,
            basicStyles.justifyEvenly,
          ]}>
          <View style={[styles.fromDateFieldContainer, {width: wp(87)}]}>
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

        <TouchableOpacity onPress={this.handleFilePick}>
          <Text style={styles.input}>{this.state.imageName}</Text>
        </TouchableOpacity>

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
  input: {
    height: hp(5.5),
    // backgroundColor: '#f2f1f1',
    padding: wp(2),
    borderWidth: 1,
    borderColor: '#ccc',
    textAlignVertical: 'center',
    fontSize: wp(3),
    marginBottom: wp(2),
    marginHorizontal: wp(6),
    color: '#666',
    borderRadius: wp(1),
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

  // Picker Style
  customPickerStyle: {
    width: wp(40),
    height: wp(10.2),
    borderWidth: 0.8,
    borderColor: '#9998',
    borderRadius: wp(1),
    justifyContent: 'center',
    // borderRadius: 1,
    // margin: wp(2),
  },
  pickerStyle: {
    width: wp(40),
    margin: wp(2),
  },

  templatePickerStyle: {
    width: wp(35),
    margin: wp(2),
  },

  initialTextStyle: {
    color: '#666',
    fontSize: wp(3),
    // marginLeft: wp(2),
    marginVertical: wp(0.8),
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
    marginVertical: wp(0.8),
  },
});
