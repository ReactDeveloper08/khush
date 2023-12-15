/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaView from 'react-native-safe-area-view';
import firebase from 'react-native-firebase';

// Components
import HeaderComponent from '../../components/HeaderComponent';
import NotificationListComponent from '../../components/NotificationListComponent';
import SAddTemplatePopup from '../../components/SuperAdmin/SPopUpComponent/SAddTemplatePopup';
import CustomLoader from '../../components/CustomLoader';
import ProcessingLoader from '../../components/ProcessingLoader';
import ModalSelector from 'react-native-modal-selector';

// API
import {BASE_URL, makeRequest} from '../../api/ApiInfo';

import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
import basicStyles from '../../styles/BasicStyles';

// Icons
import ic_add_plus from '../../assets/icons/ic_add_plus.png';
import showToast from '../../components/CustomToast';

export default class SNotificationScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showTemplatePop: false,
      isLoading: true,
      isProcessing: false,
      notification: null,
      connectionState: true,
      branchData: [],
      selectedBranch: {
        key: '',
        label: 'All Branch',
      },

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

      messageData: [],
      selectedTemplateMessage: {
        key: '',
        label: 'Select Template',
        desc: 'Select Template',
      },

      message: '',
      title: '',
      showImagePopup: false,
      status: 'No Notification to show ...',
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchNotifications();
    this.fetchBranches();
    this.fetchFaculty();
    this.fetchBatches();
    this.fetchTemplates();
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
              // Value: name,
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
      // starting loader
      this.setState({isLoading: true});

      // preparing params
      const params = {
        facultyId: selectedFaculty.key,
        branchId: selectedBranch.key,
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
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchTemplates = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // calling api
      const response = await makeRequest(BASE_URL + 'getTemplate', null, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {template} = response;

          const messageData = template.map(item => {
            const {id, title, description} = item;
            let data = {
              key: id,
              label: title,
              desc: description,
            };

            return data;
          });

          this.setState({messageData, isLoading: false});
        } else {
          const {message} = response;

          this.setState({
            messageData: [],
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

  fetchNotifications = async () => {
    try {
      // starting loader
      this.setState({isLoading: true});

      // calling api
      const response = await makeRequest(
        BASE_URL + 'getNotification',
        null,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {notification} = response;
          this.setState({
            notification,
            status: null,
            isLoading: false,
            isRefreshing: false,
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
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  resetNotificationCount = async params => {
    try {
      // calling api
      const response = await makeRequest(
        BASE_URL + 'resetNotificationCount',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          firebase.notifications().removeAllDeliveredNotifications();
          this.setState({isLoading: false, isRefreshing: false});
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleSendNotification = async () => {
    const {title, message, selectedBatchData, selectedFaculty, selectedBranch} =
      this.state;

    if (title.trim() === '') {
      Alert.alert('', 'Enter Title');
      return;
    }
    if (message.trim() === '') {
      Alert.alert('', 'Enter Message');
      return;
    }

    try {
      // starting loader
      this.setState({isProcessing: true});

      // preparing params
      const params = {
        title,
        description: message,
        batch_id: selectedBatchData.key,
        branch_id: selectedBranch.key,
        faculty_id: selectedFaculty.key,
        // status: 'Y',
        // sent_by: 'Admin',
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'addNotification',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success, message: toastMessage} = response;

        if (success) {
          showToast(toastMessage);
          await this.fetchNotifications();

          this.setState({
            isProcessing: false,
            selectedBranch: {
              key: '',
              label: 'All Branch',
            },
            selectedBatchData: {
              key: '',
              label: 'All Batch',
            },
            selectedFaculty: {
              key: '',
              label: 'All Faculty',
            },
            selectedTemplateMessage: {
              key: '',
              label: 'Select Template',
              desc: 'Select Template',
            },
            message: '',
            title: '',
          });
        } else {
          this.setState({
            status: message,
            isProcessing: false,
          });
        }
        // }
      } else {
        this.setState({
          isProcessing: false,
          selectedBranch: {
            key: '',
            label: 'All Branch',
          },
          selectedBatchData: {
            key: '',
            label: 'All Batch',
          },
          selectedFaculty: {
            key: '',
            label: 'All Faculty',
          },
          selectedTemplateMessage: {
            key: '',
            label: 'Select Template',
            desc: 'Select Template',
          },
          message: '',
          title: '',
        });
        showToast('Network Request Error!');
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

  handleBranchSelect = selectedBranch => {
    this.setState({selectedBranch}, () => {
      this.fetchBatches();
    });
  };

  handleBatchSelect = selectedBatchData => {
    this.setState({selectedBatchData});
  };

  handleMessageSelect = selectedTemplateMessage => {
    const {key, label, desc} = selectedTemplateMessage;
    this.setState({selectedTemplateMessage, message: desc, title: label});
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
      <NotificationListComponent
        item={item}
        nav={this.props.navigation}
        backgroundColor={backgroundColor}
      />
    );
  };
  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  handleTitleChange = changedText => {
    const {selectedTemplateMessage} = this.state;

    this.setState({
      title: changedText,
      selectedTemplateMessage: {
        Id: -1,
        Name: 'Select Template',
        Value: selectedTemplateMessage.Value,
      },
    });
  };

  handleMessageChange = changedText => {
    this.setState({
      message: changedText,
    });
  };

  handleShowTemplatePop = data => {
    this.setState({showTemplatePop: true});
    this.popData = data;
  };

  closePopup = () => {
    this.setState({showTemplatePop: false});
  };

  resetState = () => {
    this.setState({
      message: '',
      title: '',
      selectedTemplateMessage: {
        key: '',
        label: 'Select Template',
        desc: 'Select Template',
      },
    });
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {
      notification,
      isProcessing,
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
                title="Notification"
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
                // basicStyles.marginTopHalf,
                basicStyles.justifyEvenly,
              ]}>
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

              <ModalSelector
                data={messageData}
                initValue="Select Template"
                cancelText="Cancel"
                animationType="fade"
                backdropPressToClose={true}
                onChange={this.handleMessageSelect}
                style={styles.templatePickerStyle}
                initValueTextStyle={styles.initialTextStyle}
                selectTextStyle={styles.selectedTextStyle}
                optionTextStyle={styles.optionTextStyle}
              />

              <TouchableOpacity
                style={styles.addButtonStyles2}
                onPress={this.handleShowTemplatePop}>
                <Image
                  source={ic_add_plus}
                  resizeMode="cover"
                  style={styles.iconRow}
                />
              </TouchableOpacity>
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
                style={styles.titleInputStyle}
                value={this.state.title}
                onChangeText={this.handleTitleChange}
              />
            </View>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                {alignSelf: 'center', marginTop: wp(3)},
              ]}>
              <TextInput
                placeholder="Message"
                placeholderTextColor="#666"
                style={styles.loginFormTextArea}
                value={this.state.message}
                multiline={true}
                numberOfLines={6}
                onChangeText={this.handleMessageChange}
              />

              <TouchableOpacity
                style={styles.searchButton}
                onPress={this.handleSendNotification}>
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>
            </View>

            <View style={[basicStyles.marginBottom, basicStyles.flexOne]}>
              {/* <Text style={styles.textStyle}>Notification List</Text> */}
              {notification ? (
                <FlatList
                  data={notification}
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
                  <Text style={styles.messageText}>{status}</Text>
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
        {isProcessing && <ProcessingLoader />}
        {this.state.showTemplatePop && (
          <SAddTemplatePopup
            closePopup={this.closePopup}
            nav={this.props.navigation}
            fetchTemplates={this.fetchTemplates}
            resetState={this.resetState}
          />
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
  iconRow: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
  addButtonStyles2: {
    marginLeft: wp(-4),
  },
  messageText: {
    color: '#777',
    fontWeight: '700',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
  fromDateFieldContainer: {
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

  titleInputStyle: {
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
    height: hp(10),
    width: wp(62),
    fontSize: wp(3),
    marginRight: wp(5),
    borderWidth: 0.8,
    borderColor: '#999',
    textAlignVertical: 'top',
    borderRadius: wp(1),
    paddingLeft: wp(2),
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
