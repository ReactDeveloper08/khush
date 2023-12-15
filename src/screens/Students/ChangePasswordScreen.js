import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Images
import logo from '../../assets/images/logo.png';

// Components
import ProcessingLoader from '../../components/ProcessingLoader';
import HeaderComponent from '../../components/HeaderComponent';
import showToast from '../../components/CustomToast';
import ic_hide from '../../assets/icons/ic_hide.png';
import ic_show from '../../assets/icons/ic_show.png';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Validations
import {isMobileNumber} from '../../validations/validation';
import {clearData} from '../../api/UserPreference';

export default class ChangePasswordScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isProcessing: false,

      oldPassword: '',
      newPassword: '',
      confirmPassword: '',

      isHide1: true,
      isHide2: true,
      isHide3: true,
    };
  }

  handlePasswordUpdate = async () => {
    const {oldPassword, newPassword, confirmPassword} = this.state;

    // validations
    if (oldPassword.trim() === '') {
      showToast('Please enter your old password');
      return;
    }

    if (newPassword.trim() === '') {
      showToast('Please enter new password');
      return;
    }

    if (confirmPassword.trim() === '') {
      showToast('Please enter confirm password');
      return;
    } else if (newPassword !== confirmPassword) {
      showToast('Password Does Not Match');
      return;
    }
    try {
      // starting loader
      this.setState({isProcessing: true});

      // preparing params
      const params = {
        oldPassword: oldPassword,
        newPassword: confirmPassword,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'updatePassword',
        params,
        true,
      );

      // processing response
      if (response) {
        // stopping loader
        this.setState({isProcessing: false});

        const {success, message} = response;

        if (success) {
          // message
          showToast(message);
          await clearData();
          this.props.navigation.navigate('LoggedOut');
        } else {
          showToast(message);
        }
      } else {
        this.setState({isProcessing: false});
        showToast('Network Request Error!');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {isProcessing, isHide1, isHide2, isHide3} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.loginScreenContainer}>
        <HeaderComponent
          title="Change Password"
          nav={navigation}
          navAction="back"
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.loginFormView}>
          <Image source={logo} resizeMode="cover" style={styles.logo} />

          <View style={styles.loginFormInputContainer}>
            <TextInput
              placeholder="Old Password"
              placeholderTextColor="#666"
              style={styles.loginFormTextInput}
              value={this.state.oldPassword}
              secureTextEntry={isHide1}
              onChangeText={e => {
                this.setState({oldPassword: e});
              }}
            />

            <TouchableOpacity
              onPress={() => {
                this.setState({isHide1: !this.state.isHide1});
              }}>
              <Image
                source={isHide1 ? ic_show : ic_hide}
                style={styles.iconsStyle}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.loginFormInputContainer}>
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#666"
              style={styles.loginFormTextInput}
              value={this.state.newPassword}
              secureTextEntry={isHide2}
              onChangeText={e => {
                this.setState({newPassword: e});
              }}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({isHide2: !this.state.isHide2});
              }}>
              <Image
                source={isHide2 ? ic_show : ic_hide}
                style={styles.iconsStyle}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.loginFormInputContainer}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              style={styles.loginFormTextInput}
              value={this.state.confirmPassword}
              secureTextEntry={isHide3}
              onChangeText={e => {
                this.setState({confirmPassword: e});
              }}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({isHide3: !this.state.isHide3});
              }}>
              <Image
                source={isHide3 ? ic_show : ic_hide}
                style={styles.iconsStyle}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.handlePasswordUpdate}>
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  loginScreenContainer: {
    flex: 1,
  },
  loginFormView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(3),
  },
  logo: {
    height: wp(20),
    aspectRatio: 3 / 1,
    marginBottom: hp(8),
    alignSelf: 'center',
  },
  loginFormInputContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    // height: hp(4),
    width: wp(85),
    fontSize: wp(3.7),
    marginVertical: wp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    flexDirection: 'row',
  },
  loginFormTextInput: {
    fontSize: wp(3.7),
    marginLeft: wp(2),
    flex: 1,
    // marginBottom: hp(2),
  },

  messageInputContainer: {
    alignSelf: 'center',
    // alignItems: 'center',
    backgroundColor: '#ddd',
    height: hp(15),
    width: wp(85),
    fontSize: wp(3.7),
    marginVertical: wp(4),
    // borderBottomWidth: 1,
    borderColor: '#999',
    flexDirection: 'row',
  },

  messageFormTextInput: {
    marginLeft: wp(2),
    fontSize: wp(3.7),
    marginRight: wp(5),
    textAlignVertical: 'top',
    borderRadius: wp(1),
    flex: 1,
    // paddingLeft: wp(2),
  },
  button: {
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d99d2',
    marginTop: hp(8),
    width: wp(60),
    alignSelf: 'center',
    borderRadius: wp(2),
  },
  buttonText: {
    color: 'white',
    fontSize: wp(3.7),
  },
  iconsStyle: {
    height: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
});
