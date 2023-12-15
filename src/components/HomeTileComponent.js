import React, {PureComponent} from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Styles
import homeTileStyles from '../styles/components/HomeTileStyles';

// User Preference
import {clearData} from '../api/UserPreference';

export default class HomeTileComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cartItemCount: 0,
      userLogin: false,
      userImage: null,
      notificationCount: props.notificationCount,
    };
  }

  handleLogoutOkPress = async () => {
    try {
      // clearing user preferences
      await clearData();

      // resetting navigation
      this.props.nav.navigate('LoggedOut');
    } catch (error) {
      console.log(error.message);
    }
  };

  handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure, you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: this.handleLogoutOkPress},
      ],
      {cancelable: false},
    );
  };

  handleScreen = () => {
    if (this.props.route === 'Logout') {
      this.handleLogout();
    } else {
      this.props.nav.navigate(this.props.route);
    }
  };

  render() {
    const {notificationCount} = this.state;

    const showNotificationBadge = notificationCount > 0;
    const isNotificationCountTwoDigit = notificationCount < 100;

    return (
      <TouchableOpacity
        onPress={this.handleScreen}
        style={[
          homeTileStyles.tileContent,
          {
            backgroundColor:
              '#' +
              (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) +
              55,
          },
        ]}>
        {showNotificationBadge &&
          this.props.title === 'Notification' &&
          notificationCount > 0 && (
            <View style={styles.cartBadgeContainer}>
              {isNotificationCountTwoDigit ? (
                <Text style={styles.cartBadge}> {notificationCount} </Text>
              ) : (
                <Text style={styles.cartBadge}> 99 + </Text>
              )}
            </View>
          )}
        <Image
          source={this.props.tileIcon}
          resizeMode="cover"
          style={homeTileStyles.tileIcon}
        />
        <Text style={homeTileStyles.titleStyle}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  cartBadgeContainer: {
    width: wp(5.5),
    aspectRatio: 1 / 1,
    backgroundColor: '#be0000',
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -2,
    right: -2,
  },
  cartBadge: {
    color: '#fff',
    fontSize: wp(2.2),
    textAlign: 'center',
  },
});
