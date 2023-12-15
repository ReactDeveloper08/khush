import React, {Component} from 'react';
import {Text, View, TouchableOpacity, Image, Alert} from 'react-native';

// Styles
import HeaderComponentStyles from '../styles/components/HeaderComponentStyles';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Icons
import ic_back from '../assets/icons/ic_back.png';
import ic_menu_white from '../assets/icons/ic_menu_white.png';
import {BASE_URL, makeRequest} from '../api/ApiInfo';
import {clearData, getData, KEYS} from '../api/UserPreference';
import LinearGradient from 'react-native-linear-gradient';
import file from '../assets/icons/file.png';
export default class HeaderComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.checkLogin();
  }

  checkLogin = async () => {
    try {
      const userInfo = await getData(KEYS.USER_INFO);

      if (!userInfo) {
        return;
      }

      const {authToken} = userInfo;

      const params = {
        token: authToken,
      };

      // calling api
      const response = await makeRequest(BASE_URL + 'checklogin', params, true);

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          this.setState({isLoading: false});
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
            sliderImage: ['https://i.imgur.com/XP2BE7q.jpg'],
            isLoading: false,
          });
        }
      } else {
        this.setState({
          sliderImage: ['https://i.imgur.com/XP2BE7q.jpg'],
          isLoading: false,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleTokenExpire = async () => {
    await clearData();
    this.props.nav.navigate('LoggedOut');
  };

  handleDrawer = () => {
    this.props.nav.openDrawer();
  };

  handleBack = () => {
    this.props.nav.pop();
  };

  // let handleNavAction = handleDrawer;
  // let navIcon = ic_menu_white;

  // if (navAction === 'back') {
  //   handleNavAction = handleBack;
  //   navIcon = ic_back;
  // }

  render() {
    const {nav, title, navAction} = this.props;

    let handleNavAction = this.handleDrawer;
    let navIcon = ic_menu_white;

    if (navAction === 'back') {
      handleNavAction = this.handleBack;
      navIcon = ic_back;
    }

    if (navAction === 'file') {
      navIcon = file;
    }
    return (
      <LinearGradient
        colors={['#27a7e2', '#1d99d2', '#1a89bc', '#1778a5']}
        style={HeaderComponentStyles.linearGradient}>
        <View style={HeaderComponentStyles.headerContainer}>
          <TouchableOpacity
            onPress={handleNavAction}
            style={{
              paddingHorizontal: wp(4),
              paddingVertical: wp(2),
            }}>
            <Image
              source={navIcon}
              resizeMode="cover"
              style={HeaderComponentStyles.backIcon}
            />
          </TouchableOpacity>
          <Text style={[HeaderComponentStyles.headerTitle, {margin: wp(2)}]}>
            {title}
          </Text>
        </View>
      </LinearGradient>
    );
  }
}
