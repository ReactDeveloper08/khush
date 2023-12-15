import React, {Component} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from 'react-native';
import HeaderComponent from '../../components/HeaderComponent';
import DocumentPicker from 'react-native-document-picker';
import {KEYS, getData} from '../../api/UserPreference';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import showToast from '../../components/CustomToast';
import NetInfo from '@react-native-community/netinfo';
import ProcessingLoader from '../../components/ProcessingLoader';
import CustomLoader from '../../components/CustomLoader';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class UploadCV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isRefreshing: false,
      isProcessing: false,
      connectionState: true,
      selectedFile: null,
      isFileSelected: false,
      cvUrl: null,
      is_deleted: null,
      isFileDeleted: false, // Flag to indicate if the file is deleted
    };
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.handleUpload();
    this.handleViewCv();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleRefresh = () => {
    this.setState({isRefreshing: true}, () => {
      // Refresh logic if needed
    });
  };

  handleFilePick = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const {name, size} = response;
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB in bytes

      if (size <= maxSizeInBytes) {
        const extension = name.split('.').pop();
        const isFileAllowed =
          extension === 'pdf' ||
          extension === 'jpeg' ||
          extension === 'jpg' ||
          extension === 'png';

        if (isFileAllowed) {
          this.setState({selectedFile: response, isFileSelected: true});
        } else {
          Alert.alert(`.${extension} file not allowed`);
        }
      } else {
        Alert.alert('File size exceeds 2MB. Please choose a smaller file.');
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };

  handleUpload = async () => {
    try {
      const selectedFile = this.state;
      const userInfo = await getData(KEYS.USER_INFO);

      const {s_id} = userInfo;
      this.setState({isLoading: true});

      const params = {
        student_id: s_id,
        files: selectedFile.selectedFile,
      };

      const response = await makeRequest(BASE_URL + 'uploadcv', params, true);
      // showToast(response.message);

      if (response.success) {
        this.setState({cvUrl: response.cv_file, isFileSelected: false}, () => {
          this.handleViewCv();
        });
      }

      this.setState({isLoading: false});
    } catch (error) {
      console.error('Error uploading CV:', error);
    }
  };

  handleViewCv = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      const {s_id} = userInfo;
      const params = {
        student_id: s_id,
      };

      const response = await makeRequest(
        BASE_URL + 'studentviewcv',
        params,
        true,
      );

      if (response.success && response.cv_file) {
        const cvUrl = response.cv_file;
        const is_deleted = response.is_deleted;
        this.setState({cvUrl: cvUrl, is_deleted: is_deleted});
      }
    } catch (error) {
      console.error('Error viewing CV:', error);
      showToast('Error viewing CV. Please try again later.');
    }
  };

  toggleProcessingLoader = isProcessing => {
    this.setState({isProcessing});
  };

  openCV = () => {
    const {cvUrl} = this.state;
    if (cvUrl) {
      Linking.openURL(cvUrl);
    }
  };

  deleteStudentCV = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);
      this.setState({isLoading: true});

      const {s_id} = userInfo;
      const params = {
        student_id: s_id,
        is_delete: 'Y',
      };

      const response = await makeRequest(
        BASE_URL + 'studentcvdelete',
        params,
        true,
      );

      if (response.success) {
        console.log('CV deleted successfully');
        // Clear selected file and reset flags
        this.setState({
          isFileDeleted: true,
          selectedFile: null,
          isFileSelected: false,
          cvUrl: null,
        });

        // Refresh the screen
        this.handleRefresh();

        this.setState({isLoading: false});
      } else {
        console.error('CV deletion failed:', response.message);
        this.setState({isLoading: false});
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
    }
  };

  render() {
    if (this.state.isLoading) {
      return <CustomLoader />;
    }
    const {is_deleted} = this.state;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffff'}}>
        <HeaderComponent title="Upload Resume" nav={this.props.navigation} />

        {this.state.cvUrl ? (
          <>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderRadius: wp(2),
                padding: wp(4),
                marginTop: wp(5),
                margin: wp(4),
              }}
              onPress={this.openCV}>
              <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                My CV
              </Text>
            </TouchableOpacity>

            {is_deleted === 'Y' ? (
              <TouchableOpacity
                onPress={this.deleteStudentCV}
                style={{
                  backgroundColor: '#1d99d2',
                  borderRadius: 2,
                  paddingHorizontal: wp(3.2),
                  paddingVertical: hp(0.8),
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  marginTop: wp(5),
                }}>
                <Text style={{color: '#fff'}}>Delete CV</Text>
              </TouchableOpacity>
            ) : null}
            {/* {this.state.isFileDeleted ? (
              <TouchableOpacity
                onPress={this.handleFilePick}
                style={{
                  backgroundColor: '#1d99d2',
                  borderRadius: 2,
                  paddingHorizontal: wp(3.2),
                  paddingVertical: hp(0.8),
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  marginTop: wp(10),
                }}>
                <Text style={{color: '#fff'}}>Select File</Text>
              </TouchableOpacity>
            ) : null} */}
          </>
        ) : this.state.selectedFile ? (
          <View style={{marginTop: wp(5), margin: wp(4)}}>
            <Text style={{borderWidth: 1, borderRadius: wp(2), padding: wp(4)}}>
              {this.state.selectedFile.name}
            </Text>
            <TouchableOpacity
              onPress={this.handleUpload}
              style={{
                backgroundColor: '#1d99d2',
                borderRadius: 2,
                paddingHorizontal: wp(3.2),
                paddingVertical: hp(0.8),
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: wp(10),
              }}>
              <Text style={{color: '#fff'}}>Upload</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={this.handleFilePick}
              style={{
                backgroundColor: '#1d99d2',
                borderRadius: 2,
                paddingHorizontal: wp(3.2),
                paddingVertical: hp(0.8),
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: wp(10),
              }}>
              <Text style={{color: '#fff'}}>Select Your Resume</Text>
            </TouchableOpacity>
            <Text
              style={{
                color: 'red',
                fontSize: wp(3),
                marginTop: wp(3),
                textAlign: 'center',
              }}>
              * Maximum size for Resume is 2mb.
            </Text>
          </>
        )}
        {this.state.isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}
