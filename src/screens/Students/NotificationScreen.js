import {Platform} from 'react-native';

// API
import firebase from 'react-native-firebase';

// Delegates

// References
export let isAppOpenedByRemoteNotificationWhenAppClosed = false;

import {KEYS, getData} from '../api/UserPreference';
import uploadToken from '../../firebase_api/UploadTokenAPI';
import {homeScreenFetchNotificationCount} from './MyHomeScreen';
import {nsNavigate} from '../../routes/NavigationService';

// Android Notification Channel for Local Notifications
const createAndroidNotificationChannel = () => {
  try {
    // Build a channel
    const channel = new firebase.notifications.Android.Channel(
      'daac',
      'daac channel',
      firebase.notifications.Android.Importance.Max,
    ).setDescription('daac app channel');

    // Create the channel
    firebase.notifications().android.createChannel(channel);
  } catch (error) {
    console.log(error.message);
  }
};

export const checkPermission = async () => {
  try {
    const enabled = await firebase.messaging().hasPermission();

    if (enabled) {
      // setting up android notification channel
      if (Platform.OS === 'android') {
        createAndroidNotificationChannel();
      }

      // fetching fcm token
      await getToken();
    } else {
      await requestPermission();
    }
  } catch (error) {
    console.log(error.message);
  }
};

const requestPermission = async () => {
  try {
    // requesting permission
    await firebase.messaging().requestPermission();

    // User has authorized:
    // setting up android notification channel
    if (Platform.OS === 'android') {
      createAndroidNotificationChannel();
    }

    // fetching fcm token
    await getToken();
  } catch (error) {
    // User has rejected permission
    console.log('User has rejected permission:', error.message);
  }
};

const getToken = async () => {
  try {
    const fcmToken = await firebase.messaging().getToken();

    if (fcmToken) {
      // calling api to upload token
      const response = await uploadToken(fcmToken);
      // calling api again in case of failure
      if (response && response.success !== 1) {
        await uploadToken(fcmToken);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

// Token Listeners
const onTokenRefreshCallback = async fcmToken => {
  try {
    if (fcmToken) {
      // calling api to update token
      const response = await uploadToken(fcmToken);

      // calling api again in case of failure
      if (response && response.success !== 1) {
        await uploadToken(fcmToken);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const createOnTokenRefreshListener = thisArg => {
  thisArg.onTokenRefreshListener = firebase
    .messaging()
    .onTokenRefresh(onTokenRefreshCallback);
};

export const removeOnTokenRefreshListener = thisArg => {
  thisArg.onTokenRefreshListener();
};

// Notification Listeners
export const createNotificationListeners = async thisArg => {
  // Triggered when a particular notification has been received in foreground
  const onNotificationCallback = async notification => {
    // build the notification
    notification.setSound('default');

    if (Platform.OS === 'android') {
      notification.android
        .setAutoCancel(true)
        .android.setColor('#0082c7')
        .android.setSmallIcon('ic_notification')
        .android.setChannelId('daac')
        .android.setPriority(firebase.notifications.Android.Priority.Max);
    }

    // display the notification
    firebase.notifications().displayNotification(notification);

    // updating notification count on home screen if it is focused
    // nsNavigate('Notification');
    // if (homeScreenFetchNotificationCount) {
    await homeScreenFetchNotificationCount();

    // }
  };

  thisArg.onNotificationListener = firebase
    .notifications()
    .onNotification(onNotificationCallback);

  // If your app is in background, you can listen for when a notification is clicked/tapped/opened
  thisArg.onNotificationOpenedListener = firebase
    .notifications()
    .onNotificationOpened(async notificationObj => {
      nsNavigate('Notification');
    });

  // If your app is closed, you can check if it was opened by a notification being clicked/tapped/opened
  const initialNotification = await firebase
    .notifications()
    .getInitialNotification();

  if (initialNotification) {
    nsNavigate('Notification');
    isAppOpenedByRemoteNotificationWhenAppClosed = true;
  }
};

export const removeNotificationListeners = thisArg => {
  // Remove listeners allocated in createNotificationListeners()
  thisArg.onNotificationListener();
  thisArg.onNotificationOpenedListener();
};

export const resetIsAppOpenedByRemoteNotificationWhenAppClosed = () => {
  isAppOpenedByRemoteNotificationWhenAppClosed = false;
};
