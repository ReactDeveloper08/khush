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
import ic_admission from '../../assets/icons/ic_admission.png';
import ic_student from '../../assets/icons/ic_student.png';
import ic_fees from '../../assets/icons/ic_fees.png';
import ic_batch from '../../assets/icons/ic_batch.png';
import ic_team from '../../assets/icons/ic_team.png';
import ic_gallery_dr from '../../assets/icons/ic_gallery_dr.png';
import ic_notification from '../../assets/icons/ic_notification.png';
import ic_attendancedr from '../../assets/icons/ic_attendancedr.png';
import ic_assignment from '../../assets/icons/ic_assignment.png';
import ic_interview from '../../assets/icons/ic_interview.png';
import ic_quiz from '../../assets/icons/ic_quiz.png';
import ic_job_fiend from '../../assets/icons/ic_job_fiend.png';
import ic_video from '../../assets/icons/ic_video.png';
import ic_contact from '../../assets/icons/ic_contact.png';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

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
      notificationCount: 5,
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
    await checkPermission();

    this.fetchSliderImages();
  };
  componentWillUnmount() {
    this.unsubscribe();
  }
  handleUserCheck = async () => {
    const userInfo = await getData(KEYS.USER_INFO);
    const isLoggedIn = userInfo ? true : false;

    this.setState({isLoggedIn});
  };

  fetchSliderImages = async () => {
    try {
      // calling api
      const response = await makeRequest(
        BASE_URL + 'getHomeSlider',
        null,
        true,
      );

      // processing response
      if (response) {
        const {success} = response;

        if (success) {
          const {sliderImage} = response;
          this.setState({sliderImage, isLoading: false});
        } else {
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
            <HeaderComponent title="Admin Home" nav={navigation} />

            <View style={homeStyles.sliderContainer}>
              <ImageSlider
                loop
                // loopBothSides
                // autoPlayWithInterval={2000}
                images={sliderImage}
              />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={homeStyles.contentContainer}>
              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="SBatch"
                  tileIcon={ic_batch}
                  title="Batch"
                  nav={navigation}
                />
                <HomeTileComponent
                  route="Students"
                  tileIcon={ic_student}
                  title="Student"
                  nav={navigation}
                />
              </View>

              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="SAttendance"
                  tileIcon={ic_attendancedr}
                  title="Attendance"
                  nav={navigation}
                />
                <HomeTileComponent
                  route="SAttendanceSum"
                  tileIcon={ic_attendancedr}
                  title="Attendance Summary"
                  nav={navigation}
                />
              </View>

              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="SAssignments"
                  tileIcon={ic_assignment}
                  title="Assignment"
                  nav={navigation}
                />
                <HomeTileComponent
                  route="SAssignmentSum"
                  tileIcon={ic_assignment}
                  title="Assignment Summary"
                  nav={navigation}
                />
              </View>

              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="SAdmission"
                  tileIcon={ic_admission}
                  title="Registration"
                  nav={navigation}
                />
                <HomeTileComponent
                  route="SNotification"
                  tileIcon={ic_notification}
                  title="Notification"
                  nav={navigation}
                />
              </View>

              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="Payments"
                  tileIcon={ic_fees}
                  title="Payments"
                  nav={navigation}
                />

                <HomeTileComponent
                  route="Fees Summary"
                  tileIcon={ic_fees}
                  title="Fees"
                  nav={navigation}
                />
              </View>

              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="Courses"
                  tileIcon={ic_courses}
                  title="Courses"
                  nav={navigation}
                />
                <HomeTileComponent
                  route="Free Videos"
                  tileIcon={ic_video}
                  title="Free Videos"
                  nav={navigation}
                />
              </View>

              <View style={homeStyles.tileContainer}>
                <HomeTileComponent
                  route="Quiz"
                  tileIcon={ic_quiz}
                  title="Quiz"
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
                  route="Jobs Posted"
                  tileIcon={ic_job_fiend}
                  title="Jobs Posted"
                  nav={navigation}
                />
                <HomeTileComponent
                  route="Gallery"
                  tileIcon={ic_gallery_dr}
                  title="Gallery"
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
                  route="Contact Us"
                  tileIcon={ic_contact}
                  title="Contact Us"
                  nav={navigation}
                />
              </View>
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
