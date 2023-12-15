import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import SafeAreaView from 'react-native-safe-area-view';

// Components
import ProcessingLoader from '../components/ProcessingLoader';
import showToast from '../components/CustomToast';

// API
import {makeRequest, BASE_URL} from '../api/ApiInfo';

// User Preference
import {storeData, KEYS} from '../api/UserPreference';

// Images
import logo from '../assets/images/logo.png';

export default class OTPVerificationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isProcessing: false,
    };
  }

  handleCodeFilled = async otp => {
    try {
      // fetching navigation params
      const information = this.props.navigation.getParam('info', null);

      if (information) {
        // starting loader
        this.setState({isProcessing: true});

        const {username, mobile, password} = information;

        // preparing params
        const params = {
          mobile,
          otp,
          username,
          password,
        };

        // calling api
        const response = await makeRequest(BASE_URL + 'loginOtpVerify', params);

        // processing response
        if (response) {
          const {success} = response;

          if (success) {
            const {userInfo} = response;

            // persisting userInfo
            await storeData(KEYS.USER_INFO, userInfo);

            // stopping loader
            this.setState({isProcessing: false});

            if (userInfo.role === 'Admin') {
              this.props.navigation.navigate('SuperAdmin');
            } else if (userInfo.role === 'Counsellor') {
              this.props.navigation.navigate('HrAdmin');
            } else {
              this.props.navigation.navigate('LoggedIn');
            }

            // }
          } else {
            // stopping loader
            this.setState({isProcessing: false});

            const {message} = response;
            Alert.alert('', message, [{text: 'OK'}], {
              cancelable: false,
            });
          }
        } else {
          this.setState({isProcessing: false});
          showToast('Network Request Error');
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {navigation} = this.props;
    return (
      <SafeAreaView style={{flex: 1}}>
        {/* <View style={styles.container}> */}
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}>
          <Image source={logo} resizeMode="cover" style={styles.logo} />
          <View style={styles.otpBox}>
            <Text style={styles.otpText}>
              Enter OTP To Verify Your Mobile Number
            </Text>
          </View>

          <View style={styles.otpBoxCont}>
            <OTPInputView
              style={styles.otpInput}
              pinCount={4}
              autoFocusOnLoad
              placeholderCharacter="*"
              placeholderTextColor="#555"
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={this.handleCodeFilled}
            />

            {/* <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.fetchContacts}>
                <Text style={styles.buttonText}>Resend OTP</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </KeyboardAwareScrollView>

        {this.state.isProcessing && <ProcessingLoader />}
        {/* </View> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: '10%',
  },
  logo: {
    height: wp(20),
    aspectRatio: 3 / 1,
    marginBottom: hp(20),
    alignSelf: 'center',
  },
  otpText: {
    flex: 1,
    textAlign: 'center',
    fontSize: wp(4.2),
    // fontWeight: 'bold',
  },
  otpBox: {
    width: wp(70),
    height: '10%',
    borderRadius: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: hp(-10),
  },
  otpBoxCont: {
    width: '100%',
    // height: '10%',
    borderRadius: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',

    // paddingVertical: 15,
  },
  otpInput: {
    width: '80%',
    height: 50,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },
  borderStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  underlineStyleBase: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderBottomWidth: 2,
    color: '#222',
  },
  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
  button: {
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d99d2',
    width: wp(30),
  },
  buttonText: {
    color: '#222',
    fontSize: wp(3.7),
  },
});
