import {createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {LoggedInNavigator, LoggedOutNavigator} from './StudentRoutes';
import {SuperAdminLoggedInNavigator} from './SuperAdminRoutes';
import {HrAdminLoggedInNavigator} from './HrAdminRoutes';

// Login Screens
import LoginScreen from '../screens/LoginScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';

export const SessionNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    OTPVerification: OTPVerificationScreen,
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

export const createRootNavigator = userInfo => {
  const ROUTES = {
    LoggedOut: LoggedOutNavigator,
    StudentLoggedIn: LoggedInNavigator,
    SuperAdmin: SuperAdminLoggedInNavigator,
    HrAdmin: HrAdminLoggedInNavigator,
    Session: SessionNavigator,
  };

  let initialRouteName = 'LoggedOut';

  if (userInfo) {
    const {role = null} = userInfo;

    if (role) {
      if (role === 'Admin') {
        initialRouteName = 'SuperAdmin';
      } else if (role === 'Counsellor') {
        initialRouteName = 'HrAdmin';
      } else if (role === 'Student') {
        initialRouteName = 'StudentLoggedIn';
      }
    } else {
      initialRouteName = 'LoggedOut';
    }
  }

  return createSwitchNavigator(ROUTES, {initialRouteName});
};
