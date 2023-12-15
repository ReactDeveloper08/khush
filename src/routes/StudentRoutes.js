import React from 'react';
import {View, Image, ScrollView, StyleSheet, Alert} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createSwitchNavigator} from 'react-navigation';
import SafeAreaView from 'react-native-safe-area-view';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Login Screens
import LoginScreen from '../screens/LoginScreen';
import EnquireNowScreen from '../screens/EnquireNowScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';

// Home Screens
import HomeScreen from '../screens/Students/HomeScreen';
import MyHomeScreen from '../screens/Students/MyHomeScreen';
import StAssignmentViewScreen from '../screens/Students/StAssignmentViewScreen';
import ChangePasswordScreen from '../screens/Students/ChangePasswordScreen';

// Student Profile Screens
import StudentProfileScreen from '../screens/Students/StudentProfileScreen';

// Notification Screens

// Gallery Screens
import PhotoGalleryScreen from '../screens/Students/PhotoGalleryScreen';
import PhotoGalleryDetailScreen from '../screens/Students/PhotoGalleryDetailScreen';

// Assignment Screens
import MyAssignmentScreen from '../screens/Students/MyAssignmentScreen';
import AllAssignmentsScreen from '../screens/Students/AllAssignmentsScreen';
import AssignmentViewerScreen from '../screens/Students/AssignmentViewerScreen';

// Attendance Screens
import MyAttendanceScreen from '../screens/Students/MyAttendanceScreen';
import MyAttendanceDetailScreen from '../screens/Students/MyAttendanceDetailScreen';

// Course Route Screen
import AllCoursesScreen from '../screens/Students/AllCoursesScreen';
import CourseDetailScreen from '../screens/Students/CourseDetailScreen';

// Quiz Route Screens
import QuizScreen from '../screens/Students/QuizScreen';
import QuizQuestionScreen from '../screens/Students/QuizQuestionScreen';
import QuizBookmarkedQuestionScreen from '../screens/Students/QuizBookmarkedQuestionScreen';
import QuizUnansweredBookmarksScreen from '../screens/Students/QuizUnansweredBookmarksScreen';
import QuizThankYouScreen from '../screens/Students/QuizThankYouScreen';

// Free Video Route Screens
import FreeVideoPlaylistScreen from '../screens/Students/FreeVideoPlaylistScreen';
import PlaylistVideosScreen from '../screens/Students/PlaylistVideosScreen';
import VideoPlayerScreen from '../screens/Students/VideoPlayerScreen';

// Interview Route Screens
import InterviewScreen from '../screens/Students/InterviewScreen';
import InterviewQuestionScreen from '../screens/Students/InterviewQuestionScreen';
import InterviewBookmarksScreen from '../screens/Students/InterviewBookmarksScreen';

// Find Job Screen
import FindJobScreen from '../screens/Students/FindJobScreen';

// Contact Screen
import ContactScreen from '../screens/Students/ContactScreen';

// Our Team Screen
import OurTeamScreen from '../screens/Students/OurTeamScreen';

// User Preference
import {clearData} from '../api/UserPreference';

// Images
import app_logo from '../assets/images/logo.png';

// Icons
import ic_home_black from '../assets/icons/ic_home_black.png';
import ic_courses from '../assets/icons/ic_courses.png';
import ic_interview from '../assets/icons/ic_interview.png';
import ic_video from '../assets/icons/ic_video.png';
import ic_quiz from '../assets/icons/ic_quiz.png';
import ic_job_fiend from '../assets/icons/ic_job_fiend.png';
import ic_contact from '../assets/icons/ic_contact.png';
import ic_team from '../assets/icons/ic_team.png';
import ic_gallery_dr from '../assets/icons/ic_gallery_dr.png';
import ic_notification from '../assets/icons/ic_notification.png';
import ic_assignment from '../assets/icons/ic_assignment.png';
import ic_logout from '../assets/icons/ic_logout.png';
import ic_login from '../assets/icons/ic_login.png';
import ic_student from '../assets/icons/ic_student.png';
import ic_attendancedr from '../assets/icons/ic_attendancedr.png';
import MyAttendanceDetailScreen2 from '../screens/Students/MyAttendanceDetailScreen2';
import UploadCV from '../screens/Students/UploadCVScreen';
import MarksReportScreen from '../screens/Students/MarksReportScreen';
import upload from '../assets/icons/upload.png';
import MarksScreen from '../screens/Students/MarksScreen';
import NotificationScreen from '../screens/Students/AllAssignmentsScreen';
import NotificationDetailScreen from '../screens/Students/NotificationDetailScreen';
// Style Sheet
const styles = StyleSheet.create({
  drawerItemIcon: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
  drawerContentContainer: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(2),
  },
  headerLogo: {
    height: hp(8),
    aspectRatio: 1080 / 360,
  },
  drawerLabel: {
    fontSize: wp(4),
    fontWeight: '400',
    color: '#424242',
  },
});

const setDrawerItemIcon = itemIcon => ({
  drawerIcon: (
    <Image source={itemIcon} resizeMode="cover" style={styles.drawerItemIcon} />
  ),
});

const drawerContentContainerInset = {
  top: 'always',
  horizontal: 'never',
};

const onLogoutYesPress = navigation => async () => {
  try {
    // Clearing user preferences from local storage
    await clearData();

    // Resetting Navigation to initial state for login again
    navigation.navigate('LoggedOut');
  } catch (error) {
    console.log(error.message);
  }
};

const onDrawerItemPress = props => route => {
  if (route.route.routeName !== 'Logout') {
    props.onItemPress(route);
    return;
  }

  // If 'Logout' route pressed
  props.navigation.closeDrawer();

  Alert.alert(
    'Logout',
    'Are you sure, you want to logout?',
    [
      {text: 'NO', style: 'cancel'},
      {text: 'YES', onPress: onLogoutYesPress(props.navigation)},
    ],
    {
      cancelable: false,
    },
  );
};

const CustomDrawerContentComponent = props => (
  <ScrollView>
    <SafeAreaView
      forceInset={drawerContentContainerInset}
      style={styles.drawerContentContainer}>
      <View style={styles.drawerHeader}>
        <Image source={app_logo} resizeMode="cover" style={styles.headerLogo} />
      </View>

      <DrawerItems
        {...props}
        activeTintColor="#fff"
        labelStyle={styles.drawerLabel}
        onItemPress={onDrawerItemPress(props)}
      />
    </SafeAreaView>
  </ScrollView>
);

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

const AllCoursesNavigator = createStackNavigator(
  {
    AllCourses: AllCoursesScreen,
    CourseDetail: CourseDetailScreen,
    EnquireNow: EnquireNowScreen,
  },
  {
    initialRouteName: 'AllCourses',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const QuizNavigator = createStackNavigator(
  {
    MarksReport: MarksReportScreen,
    Quiz: QuizScreen,
    Marks: MarksScreen,
    // Enquire: EnquiryNavigator,
    QuizQuestion: QuizQuestionScreen,
    QuizBookmarkedQuestion: QuizBookmarkedQuestionScreen,
    QuizUnansweredBookmarks: QuizUnansweredBookmarksScreen,
    QuizThankYou: QuizThankYouScreen,
  },
  {
    initialRouteName: 'Quiz',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const JobNavigator = createStackNavigator(
  {
    FindJob: FindJobScreen,
    // Enquire: EnquiryNavigator,
  },
  {
    initialRouteName: 'FindJob',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const GalleryNavigator = createStackNavigator(
  {
    PhotoGallery: PhotoGalleryScreen,
    GalleryDetail: PhotoGalleryDetailScreen,
  },
  {
    initialRouteName: 'PhotoGallery',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const NotificationNavigator = createStackNavigator(
  {
    Notification: NotificationScreen,
    NotificationDetail: NotificationDetailScreen,
  },
  {
    initialRouteName: 'Notification',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const FreeVideoNavigator = createStackNavigator(
  {
    FreeVideoPlaylist: FreeVideoPlaylistScreen,
    PlaylistVideos: PlaylistVideosScreen,
    VideoPlayer: VideoPlayerScreen,
  },
  {
    initialRouteName: 'FreeVideoPlaylist',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const AssignmentNavigator = createStackNavigator(
  {
    // MyAssignment: MyAssignmentScreen,
    BatchAssignments: AllAssignmentsScreen,
    AssignmentViewer: AssignmentViewerScreen,
  },
  {
    initialRouteName: 'BatchAssignments',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const StudentProfileNavigator = createStackNavigator(
  {
    StudentProfile: StudentProfileScreen,
    AssignmentView: StAssignmentViewScreen,
    ChangePassword: ChangePasswordScreen,
    AssignmentViewer: AssignmentViewerScreen,
  },
  {
    initialRouteName: 'StudentProfile',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const AttendanceNavigator = createStackNavigator(
  {
    // MyAttendance: MyAttendanceScreen,
    // MyAttendanceDetail: MyAttendanceDetailScreen,
    MyAttendanceDetail2: MyAttendanceDetailScreen2,
  },
  {
    initialRouteName: 'MyAttendanceDetail2',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const InterviewNavigator = createStackNavigator(
  {
    Interview: InterviewScreen,
    InterviewQuestion: InterviewQuestionScreen,
    InterviewBookmarks: InterviewBookmarksScreen,
  },
  {
    initialRouteName: 'Interview',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

export const LoggedOutNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: setDrawerItemIcon(ic_home_black),
    },
    Courses: {
      screen: AllCoursesNavigator,
      navigationOptions: setDrawerItemIcon(ic_courses),
    },
    Gallery: {
      screen: GalleryNavigator,
      navigationOptions: setDrawerItemIcon(ic_gallery_dr),
    },

    'Free Videos': {
      screen: FreeVideoNavigator,
      navigationOptions: setDrawerItemIcon(ic_video),
    },

    'Contact Us': {
      screen: ContactScreen,
      navigationOptions: setDrawerItemIcon(ic_contact),
    },
    'Our Team': {
      screen: OurTeamScreen,
      navigationOptions: setDrawerItemIcon(ic_team),
    },
    Login: {
      screen: SessionNavigator,
      navigationOptions: setDrawerItemIcon(ic_login),
    },
  },
  {
    initialRouteName: 'Home',
    unmountInactiveRoutes: true,
    contentComponent: CustomDrawerContentComponent,
  },
);

export const LoggedInNavigator = createDrawerNavigator(
  {
    Home: {
      screen: MyHomeScreen,
      navigationOptions: setDrawerItemIcon(ic_home_black),
    },
    'Student Profile': {
      screen: StudentProfileNavigator,
      navigationOptions: setDrawerItemIcon(ic_student),
    },

    Gallery: {
      screen: GalleryNavigator,
      navigationOptions: setDrawerItemIcon(ic_gallery_dr),
    },

    'My Assignment': {
      screen: AssignmentNavigator,
      navigationOptions: setDrawerItemIcon(ic_assignment),
    },

    'My Attendance': {
      screen: AttendanceNavigator,
      navigationOptions: setDrawerItemIcon(ic_attendancedr),
    },

    Notification: {
      screen: NotificationNavigator,
      navigationOptions: setDrawerItemIcon(ic_notification),
    },

    'Interview Question': {
      screen: InterviewNavigator,
      navigationOptions: setDrawerItemIcon(ic_interview),
    },
    'Free Videos': {
      screen: FreeVideoNavigator,
      navigationOptions: setDrawerItemIcon(ic_video),
    },
    Quiz: {
      screen: QuizNavigator,
      navigationOptions: setDrawerItemIcon(ic_quiz),
    },
    'Upload Resume': {
      screen: UploadCV,
      navigationOptions: setDrawerItemIcon(upload),
    },
    'Find Job': {
      screen: JobNavigator,
      navigationOptions: setDrawerItemIcon(ic_job_fiend),
    },
    'Contact Us': {
      screen: ContactScreen,
      navigationOptions: setDrawerItemIcon(ic_contact),
    },
    'Our Team': {
      screen: OurTeamScreen,
      navigationOptions: setDrawerItemIcon(ic_team),
    },
    Logout: {
      screen: 'No Screen',
      navigationOptions: setDrawerItemIcon(ic_logout),
    },
  },
  {
    initialRouteName: 'Home',
    unmountInactiveRoutes: true,
    contentComponent: CustomDrawerContentComponent,
  },
);
