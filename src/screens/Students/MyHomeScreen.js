import React, {Component} from 'react';
import {
  View,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  AppState,
  Alert,
} from 'react-native';
import ImageSlider from 'react-native-image-slider';
import SafeAreaView from 'react-native-safe-area-view';

// Styles
import homeStyles from '../../styles/screens/HomeStyles';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import HomeTileComponent from '../../components/HomeTileComponent';

// Icons
import ic_courses from '../../assets/icons/ic_courses.png';
import ic_interview from '../../assets/icons/ic_interview.png';
import ic_video from '../../assets/icons/ic_video.png';
import ic_quiz from '../../assets/icons/ic_quiz.png';
import ic_job_fiend from '../../assets/icons/ic_job_fiend.png';
import ic_team from '../../assets/icons/ic_team.png';
import ic_gallery_dr from '../../assets/icons/ic_gallery_dr.png';
import ic_notification from '../../assets/icons/ic_notification.png';
import ic_student from '../../assets/icons/ic_student.png';
import ic_assignment from '../../assets/icons/ic_assignment.png';
import ic_attendancedr from '../../assets/icons/ic_attendancedr.png';
import ic_contact from '../../assets/icons/ic_contact.png';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Delegates
import {
  isAppOpenedByRemoteNotificationWhenAppClosed,
  resetIsAppOpenedByRemoteNotificationWhenAppClosed,
} from '../../firebase_api/FirebaseAPI';

// References
export let homeScreenFetchNotificationCount = null;

// Firebase API
import {checkPermission} from '../../firebase_api/FirebaseAPI';
import {KEYS, getData} from '../../api/UserPreference';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      sliderImage: ['https://i.imgur.com/XP2BE7q.jpg'],
      blogs: null,
      notificationCount: 0,
      appState: AppState.currentState,
      isLoggedIn: false,
      connectionState: true,
    };
  }

  componentDidMount = async () => {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.handleUserCheck();
    this.fetchNotificationCount();
    await checkPermission();
    // navigating to Notification screen
    if (isAppOpenedByRemoteNotificationWhenAppClosed) {
      resetIsAppOpenedByRemoteNotificationWhenAppClosed();
      this.props.navigation.navigate('Notification');
      return;
    }

    homeScreenFetchNotificationCount = this.fetchNotificationCount;
    AppState.addEventListener('change', this.handleAppStateChange);

    this.fetchSliderImages();
    // this.fetchLatestBlogs();
  };

  componentWillUnmount() {
    // clearTimeout(this.intervalID);
    //setInterval(this.getNameForAccount, 5000);
    this.unsubscribe();
    homeScreenFetchNotificationCount = null;
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  handleUserCheck = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const isLoggedIn = userInfo ? true : false;

    this.setState({isLoggedIn});
  };

  handleAppStateChange = async nextAppState => {
    try {
      const {appState} = this.state;
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        await this.fetchNotificationCount();
      }

      this.setState({appState: nextAppState, isListRefreshing: false});
    } catch (error) {
      console.log(error.message);
    }
  };

  fetchNotificationCount = async () => {
    try {
      // calling api
      const response = await makeRequest(
        BASE_URL + 'getNotificationCount',
        null,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {count} = response;
          this.setState({notificationCount: count, isLoading: false});
        } else {
          this.setState({
            sliderImage: ['https://i.imgur.com/XP2BE7q.jpg'],
            isLoading: false,
          });
        }
      } else {
        this.setState({
          notificationCount: 0,
          isLoading: false,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  fetchSliderImages = async () => {
    try {
      // calling api
      const response = await makeRequest(
        BASE_URL + 'getHomeSlider',
        null,
        false,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {sliderImage} = response;
          this.setState({sliderImage, isLoading: false});
        } else {
          // const {isAuthTokenExpired} = response;

          // if (isAuthTokenExpired === true) {
          //   Alert.alert(
          //     'Session Expired',
          //     'Login Again to Continue!',
          //     [{text: 'OK', onPress: this.handleTokenExpire}],
          //     {
          //       cancelable: false,
          //     },
          //   );
          //   return;
          // }

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

  fetchLatestBlogs = async () => {
    try {
      // calling api
      const response = await makeRequest(BASE_URL + 'latest_blogs');

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {blogs} = response;
          this.setState({blogs, isLoading: false});
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleBlog = async () => {
    try {
      const {blogs} = this.state;
      const url = blogs[0].url;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {sliderImage, blogs, notificationCount} = this.state;
    const {navigation} = this.props;

    return (
      <SafeAreaView style={homeStyles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent title="Home" nav={navigation} />

            <View style={homeStyles.sliderContainer}>
              <ImageSlider
                loop
                // loopBothSides
                autoPlayWithInterval={4000}
                images={sliderImage}
              />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={homeStyles.contentContainer}>
              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="StudentProfile"
                  tileIcon={ic_student}
                  title="My Profile"
                  nav={navigation}
                />
                <HomeTileComponent
                  route="BatchAssignments"
                  tileIcon={ic_assignment}
                  title="My Assignment"
                  nav={navigation}
                />
              </View>

              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="MyAttendanceDetail2"
                  tileIcon={ic_attendancedr}
                  title="My Attendance"
                  nav={navigation}
                />

                <HomeTileComponent
                  route="Quiz"
                  tileIcon={ic_quiz}
                  title="Quiz"
                  nav={navigation}
                />
              </View>

              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="Gallery"
                  tileIcon={ic_gallery_dr}
                  title="Gallery"
                  nav={navigation}
                />
                <HomeTileComponent
                  route="Notification"
                  tileIcon={ic_notification}
                  title="Notification"
                  nav={navigation}
                  notificationCount={notificationCount}
                />
              </View>

              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="Find Job"
                  tileIcon={ic_job_fiend}
                  title="Find Job"
                  nav={navigation}
                />
                <HomeTileComponent
                  route="Interview Question"
                  tileIcon={ic_interview}
                  title="Interview Question"
                  nav={navigation}
                />
              </View>

              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="Our Team"
                  tileIcon={ic_team}
                  title="Our Team"
                  nav={navigation}
                />
                <HomeTileComponent
                  route="Free Videos"
                  tileIcon={ic_video}
                  title="Free Videos"
                  nav={navigation}
                />
                {/* <HomeTileComponent
              route="Contact Us"
              tileIcon={ic_contact}
              title="Contact Us"
              nav={navigation}
            /> */}
              </View>

              {/* <View style={homeStyles.blogContainer}> */}
              {/* <TouchableHighlight
            underlayColor="transparent"
            onPress={this.handleBlog}
            style={homeStyles.blog}>
            <Image
              source={{uri: blogs[0].image}}
              resizeMode="cover"
              style={homeStyles.blogImage}
            />
          </TouchableHighlight> */}
              {/* </View> */}
            </ScrollView>
          </>
        )}
        {this.state.connectionState === false && (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        )}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
