import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {Alert, Linking, LogBox, Platform, StatusBar} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootSiblingParent} from 'react-native-root-siblings';

// Splash Screen
import SplashScreen from './src/screens/SplashScreen';

// User Preference
import {KEYS, getData} from './src/api/UserPreference';

// Routes
import {createRootNavigator} from './src/routes/Routes';

import {nsSetTopLevelNavigator} from './src/routes/NavigationService';

import AppStatusBarComponent from './src/components/AppStatusBarComponent';

// Firebase API
import {
  checkPermission,
  createOnTokenRefreshListener,
  removeOnTokenRefreshListener,
  createNotificationListeners,
  removeNotificationListeners,
} from './src/firebase_api/FirebaseAPI';

// internet alert
import InternetConnectionAlert from 'react-native-internet-connection-alert';
import deviceInfoModule from 'react-native-device-info';
import {BASE_URL, makeRequest} from './src/api/ApiInfo';

// Ignore log notification by message:
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isLoggedIn: false,
      userInfo: null,
    };
  }
  update = async () => {
    try {
      let buildNumber = deviceInfoModule.getBuildNumber();
      console.log('====================================');
      console.log('@#@~@~', buildNumber);
      console.log('====================================');
      let params = {
        build_no: buildNumber,
      };
      const response = await makeRequest(BASE_URL + 'versioncheck', params);
      const {success, app_url, message} = response;
      if (success === false) {
        if (Platform.OS === 'ios') {
          // Show different alert for iOS
          Alert.alert('iOS Update', message, [
            {
              text: 'Update',
              onPress: () => {
                Linking.openURL(app_url); // This will open the URL in the default browser
              },
            },
          ]);
        } else {
          // Show default alert for other platforms
          Alert.alert('Update', message, [
            {
              text: 'Update',
              onPress: () => {
                Linking.openURL(app_url); // This will open the URL in the default browser
              },
            },
          ]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  componentDidMount() {
    this.update();
    try {
      setTimeout(this.initialSetup, 2000);

      // Adding firebase listeners
      createOnTokenRefreshListener(this);
      createNotificationListeners(this);
    } catch (error) {
      console.log(error.message);
    }
  }

  componentWillUnmount() {
    // // Removing firebase listeners
    removeOnTokenRefreshListener(this);
    removeNotificationListeners(this);
  }

  initialSetup = async () => {
    try {
      // Fcm Permission
      await checkPermission();

      // Fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);
      const isLoggedIn = userInfo ? true : false;

      this.setState({isLoggedIn, isLoading: false, userInfo});
    } catch (error) {
      console.log(error.message);
    }
  };

  setNavigatorRef = ref => {
    nsSetTopLevelNavigator(ref);
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <SplashScreen />;
    }

    const {isLoggedIn, userInfo} = this.state;
    const RootNavigator = createRootNavigator(userInfo);
    const AppContainer = createAppContainer(RootNavigator);
    return (
      <InternetConnectionAlert
        onChange={connectionState => {
          console.log('Connection State: ', connectionState);
        }}>
        <RootSiblingParent>
          <SafeAreaProvider>
            <AppStatusBarComponent
              barStyle={'default'}
              backgroundColor={'#27a7e1'}
            />
            <AppContainer ref={this.setNavigatorRef} />
          </SafeAreaProvider>
        </RootSiblingParent>
      </InternetConnectionAlert>
    );
  }
}
