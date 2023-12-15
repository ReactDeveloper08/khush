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
import OTPInputView from '@twotalltotems/react-native-otp-input';
import basicStyles from '../../../styles/BasicStyles';

// Icons
import ic_close from '../../../assets/icons/ic_close.png';

// API
import {BASE_URL, makeRequest} from '../../../api/ApiInfo';

// User Preference
import {KEYS, getData} from '../../../api/UserPreference';
import showToast from '../../CustomToast';
import ProcessingLoader from '../../ProcessingLoader';

class SAttendancePopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
    };

    this.parentView = null;
  }

  setViewRef = ref => {
    this.parentView = ref;
  };

  handleStartShouldSetResponder = event => {
    if (this.parentView._nativeTag === event.target._nativeTag) {
      this.props.closePopup();
    }
  };

  handleClose = () => {
    this.props.closePopup();
  };

  componentDidMount() {
    setTimeout(() => {
      this.otpInput.focusField(0);
    }, 500);
  }

  handleCodeFilled = async otp => {
    const {data} = this.props;
    const {id} = data;
    try {
      // starting loader
      this.setState({isProcessing: true});

      const params = {
        id: id,
        otp: otp,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'paymentApproval',
        params,
        true,
      );

      // processing response
      if (response) {
        const {success, message} = response;

        if (success) {
          this.setState({isProcessing: false});
          await this.props.fetchPayments();
          this.props.closePopup();
          showToast(message);
        } else {
          this.setState({isProcessing: false});
          // this.props.closePopup();
          showToast(message);
        }
        // }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    return (
      <View
        ref={this.setViewRef}
        onStartShouldSetResponder={this.handleStartShouldSetResponder}
        style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <Text style={styles.headingStyle}>Enter OTP To Verify</Text>

          <View style={styles.otpBoxCont}>
            <OTPInputView
              ref={input => (this.otpInput = input)}
              style={styles.otpInput}
              pinCount={4}
              autoFocusOnLoad={false}
              placeholderCharacter="*"
              placeholderTextColor="#555"
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={this.handleCodeFilled}
            />

            <TouchableOpacity style={styles.button} onPress={this.handleClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {this.state.isProcessing && <ProcessingLoader />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: wp(80),
    backgroundColor: 'white',
    padding: wp(5),
  },
  headingStyle: {
    fontSize: wp(3.2),
    fontWeight: '400',
    textAlign: 'center',

    marginBottom: wp(4),
  },

  closeButton: {
    position: 'absolute',
    top: wp(-3),
    right: wp(-3),
  },

  submitButton: {
    backgroundColor: '#0077a2',
    alignSelf: 'center',
    paddingVertical: wp(2),
    paddingHorizontal: wp(8),
    marginTop: wp(3),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: '700',
  },
  popupHeading: {
    fontSize: wp(3.5),
    fontWeight: '700',
    marginBottom: wp(3),
    textAlign: 'center',
  },
  closeIcon: {
    height: hp(3.5),
    aspectRatio: 1 / 1,
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: hp(-10),
  },
  otpBoxCont: {
    width: '100%',
    // height: '10%',
    borderRadius: 5,
    // justifyContent: 'space-evenly',
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
    marginTop: wp(3),
    height: hp(4),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d99d2',
    width: wp(30),
  },
});

export default SAttendancePopUp;
