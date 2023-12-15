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
// import {
//   check,
//   request,
//   openSettings,
//   PERMISSIONS,
//   RESULTS,
// } from 'react-native-permissions';
// import Contacts from 'react-native-contacts';
import SafeAreaView from 'react-native-safe-area-view';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Images
import logo from '../assets/images/logo.png';

// Styles
// import styles from '../styles/screens/LoginStyle';

// Components
import ProcessingLoader from '../components/ProcessingLoader';
import HeaderComponent from '../components/HeaderComponent';
import showToast from '../components/CustomToast';
import ic_hide from '../assets/icons/ic_hide.png';
import ic_show from '../assets/icons/ic_show.png';

// API
import {makeRequest, BASE_URL} from '../api/ApiInfo';

// Validations
import {isMobileNumber} from '../validations/validation';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isProcessing: false,

      name: '',
      email: '',
      phone: '',
      comment: '',
    };
  }

  componentDidMount() {
    // this.handleReadContactsPermission();
  }

  // onNameChange = name => {
  //   this.setState({name});
  // };

  // onMobileNumberChange = mobile => {
  //   this.setState({mobile});
  // };

  handleEnquire = async () => {
    // // checking read contacts permission
    // const {readContactsPlatformPermission} = this;
    // if (readContactsPlatformPermission !== 'GRANTED') {
    //   this.handleReadContactsPermission();
    //   return;
    // }

    const courseItems = await this.props.navigation.getParam('courseItems');

    const {id: courseId} = courseItems;

    const {name, phone, email, comment} = this.state;

    // validations
    if (name.trim() === '') {
      showToast('Please enter your name');
      return;
    }

    if (email.trim() === '') {
      showToast('Please enter your email');
      return;
    }

    if (!isMobileNumber(phone)) {
      showToast('Please enter a valid Mobile Number');
      return;
    }

    if (comment.trim() === '') {
      showToast('Please enter your comment');
      return;
    }

    try {
      // starting loader
      this.setState({isProcessing: true});

      // preparing params
      const params = {
        name: name,
        email: email,
        phone: phone,
        course: courseId,
        comment: comment,
      };

      // calling api
      const response = await makeRequest(
        BASE_URL + 'enquireCourse',
        params,
        false,
      );

      // processing response
      if (response) {
        // stopping loader
        this.setState({isProcessing: false});

        const {success, message} = response;

        if (success) {
          // message
          showToast(message);
          this.props.navigation.pop();
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

  // handleReadContactsPermission = async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       const platformPermission = PERMISSIONS.ANDROID.READ_CONTACTS;
  //       const result = await check(platformPermission);

  //       switch (result) {
  //         case RESULTS.UNAVAILABLE:
  //           console.log(
  //             'This feature is not available (on this device / in this context)',
  //           );
  //           break;
  //         case RESULTS.DENIED:
  //           // console.log(
  //           //   'The permission has not been requested / is denied but requestable',
  //           // );
  //           await request(platformPermission);
  //           break;
  //         case RESULTS.GRANTED:
  //           // console.log("The permission is granted");
  //           this.readContactsPlatformPermission = 'GRANTED';
  //           break;
  //         case RESULTS.BLOCKED:
  //           // console.log('The permission is denied and not requestable anymore');
  //           Alert.alert(
  //             'Permission Blocked',
  //             'Press OK and provide "Contacts" permission in App Setting',
  //             [
  //               {
  //                 text: 'Cancel',
  //                 style: 'cancel',
  //               },
  //               {
  //                 text: 'OK',
  //                 onPress: this.handleOpenSettings,
  //               },
  //             ],
  //             {cancelable: false},
  //           );
  //       }
  //     } else if (Platform.OS === 'ios') {
  //       Contacts.checkPermission((err, permission) => {
  //         if (err) {
  //           throw err;
  //         }

  //         if (permission === 'undefined') {
  //           Contacts.requestPermission((err, permission) => {
  //             if (err) {
  //               throw err;
  //             }

  //             if (permission === 'undefined') {
  //               console.log('Permission undefined');
  //             } else if (permission === 'authorized') {
  //               this.readContactsPlatformPermission = 'GRANTED';
  //             } else if (permission === 'denied') {
  //               Alert.alert(
  //                 'Permission Blocked',
  //                 'Provide "Contacts" permission in App Setting',
  //                 [
  //                   {
  //                     text: 'OK',
  //                     style: 'cancel',
  //                   },
  //                 ],
  //                 {cancelable: false},
  //               );
  //             }
  //           });
  //         } else if (permission === 'authorized') {
  //           this.readContactsPlatformPermission = 'GRANTED';
  //         } else if (permission === 'denied') {
  //           Alert.alert(
  //             'Permission Blocked',
  //             'Provide "Contacts" permission in App Setting',
  //             [
  //               {
  //                 text: 'OK',
  //                 style: 'cancel',
  //               },
  //             ],
  //             {cancelable: false},
  //           );
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // handleOpenSettings = async () => {
  //   try {
  //     await openSettings();
  //   } catch (error) {
  //     console.log('Unable to open App Settings:', error);
  //   }
  // };

  render() {
    const {isProcessing, isHidden} = this.state;
    const {navigation} = this.props;
    return (
      <SafeAreaView style={styles.loginScreenContainer}>
        <HeaderComponent
          title="Enquire Course"
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
              placeholder="Name"
              placeholderTextColor="#666"
              style={styles.loginFormTextInput}
              value={this.state.name}
              onChangeText={e => {
                this.setState({name: e});
              }}
            />
          </View>

          <View style={styles.loginFormInputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#666"
              style={styles.loginFormTextInput}
              value={this.state.email}
              onChangeText={e => {
                this.setState({email: e});
              }}
            />
          </View>

          <View style={styles.loginFormInputContainer}>
            <TextInput
              style={styles.loginFormTextInput}
              placeholder="Mobile"
              placeholderTextColor="#666"
              value={this.state.phone}
              keyboardType="number-pad"
              maxLength={10}
              onChangeText={e => {
                this.setState({phone: e});
              }}
            />
          </View>

          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageFormTextInput}
              placeholder="Message"
              placeholderTextColor="#666"
              value={this.state.comment}
              onChangeText={e => {
                this.setState({comment: e});
              }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleEnquire}>
              <Text style={styles.buttonText}>Proceed</Text>
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
    marginVertical: wp(3),
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
