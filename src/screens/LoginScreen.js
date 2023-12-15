import * as React from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// Images
import logo from '../assets/images/logo.png';
import ic_hide from '../assets/icons/ic_hide.png';
import ic_show from '../assets/icons/ic_show.png';

// Styles
import styles from '../styles/screens/LoginStyle';

// Components
import ProcessingLoader from '../components/ProcessingLoader';
import HeaderComponent from '../components/HeaderComponent';
import showToast from '../components/CustomToast';

// API
import {makeRequest, BASE_URL} from '../api/ApiInfo';

// Validations
import {isMobileNumber} from '../validations/validation';
import {KEYS, storeData} from '../api/UserPreference';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isProcessing: false,
      username: '',
      password: '',
      isHidden: true,
    };
  }

  onUsernameChange = username => {
    this.setState({username});
  };

  onPasswordChange = password => {
    this.setState({password});
  };

  handleLogin = async () => {
    const {username, password} = this.state;

    // validations
    if (username.trim() === '') {
      Alert.alert(
        'Alert!',
        'Please enter Username / Enroll No',
        [{text: 'OK'}],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (password.trim() === '') {
      Alert.alert('Alert!', 'Please enter Password', [{text: 'OK'}], {
        cancelable: false,
      });
      return;
    }

    try {
      // starting loader
      this.setState({isProcessing: true});

      // preparing params
      const params = {
        username,
        password,
      };

      // calling api
      const response = await makeRequest(BASE_URL + 'login', params);

      // processing response
      if (response) {
        this.setState({isProcessing: false});

        const {success, message} = response;

        if (success) {
          const info = response;
          const {userInfo} = response;

          if (userInfo) {
            const {role} = userInfo;

            if (role === 'Student') {
              await storeData(KEYS.USER_INFO, userInfo);
              showToast('Logged In Success');
              this.props.navigation.navigate('StudentLoggedIn');
              return;
            }
          }

          // message
          showToast('OTP has been sent to the registered number');

          // navigating to OTP Verification Screen
          this.props.navigation.push('OTPVerification', {info});
        } else {
          showToast(message);
        }
      } else {
        this.setState({isProcessing: false});
        showToast('Network Request Error');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {isProcessing, isHidden} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.loginScreenContainer}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.loginFormView}>
          <Image source={logo} resizeMode="cover" style={styles.logo} />

          <View style={styles.loginFormInputContainer}>
            <TextInput
              placeholder="Username / Enroll No."
              placeholderTextColor="#666"
              style={styles.loginFormTextInput}
              value={this.state.username}
              onChangeText={this.onUsernameChange}
            />
          </View>

          <View style={styles.loginFormInputContainer}>
            <TextInput
              style={styles.loginFormTextInput}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={isHidden}
              value={this.state.password}
              onChangeText={this.onPasswordChange}
            />
            <TouchableOpacity
              onPress={() => {
                this.setState({isHidden: !this.state.isHidden});
              }}>
              <Image
                source={isHidden ? ic_show : ic_hide}
                style={styles.iconsStyle}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
              <Text style={styles.buttonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>

        {isProcessing && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}
