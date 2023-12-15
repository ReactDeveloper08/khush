import React from 'react';
import {View, Image, ScrollView, StyleSheet, Alert} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import SafeAreaView from 'react-native-safe-area-view';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Home Screens
import SHomeScreen from '../screens/SuperAdmin/SHomeScreen';

// Student Screens
import SStudentsScreen from '../screens/SuperAdmin/SStudentsScreen';
import SStudentDetailScreen from '../screens/SuperAdmin/SStudentDetailScreen';

// Batch Screens
import SBatchScreen from '../screens/SuperAdmin/SBatchScreen';
import SBatchDetailScreen from '../screens/SuperAdmin/SBatchDetailScreen';

// Admission Screens
import SAdmissionScreen from '../screens/SuperAdmin/SAdmissionScreen';

// Payments Screens
import SPaymentsScreen from '../screens/SuperAdmin/SPaymentsScreen';

// Fees Screens
import SFeesScreen from '../screens/SuperAdmin/SFeesScreen';

// Contact Screen
import ContactScreen from '../screens/Students/ContactScreen';

// Notification Screens
import SNotificationScreen from '../screens/SuperAdmin/SNotificationScreen';

// Attendance Screens
import SAttendanceSummary from '../screens/SuperAdmin/SAttendanceSummary';
import SAllAssignmentsScreen from '../screens/SuperAdmin/SAllAssignmentsScreen';
import SAttendanceScreen from '../screens/SuperAdmin/SAttendanceScreen';
import SAttendanceStudentsScreen from '../screens/SuperAdmin/SAttendanceStudentsScreen';

// Assignments Screens
import SAssignmentsScreen from '../screens/SuperAdmin/SAssignmentsScreen';
import SAssignmentDetailScreen from '../screens/SuperAdmin/SAssignmentDetailScreen';
import SAssignmentSummary from '../screens/SuperAdmin/SAssignmentSummary';
import AssignmentViewScreen from '../screens/HrAdmin/HrAssignmentViewScreen';
import AssignmentViewerScreen from '../screens/Students/AssignmentViewerScreen';

// Gallery Screens
import SPhotoGalleryScreen from '../screens/SuperAdmin/SPhotoGalleryScreen';
import SPhotoGalleryDetailScreen from '../screens/SuperAdmin/SPhotoGalleryDetailScreen';

// Quiz Route Screens
import QuizScreen from '../screens/Students/QuizScreen';
import QuizQuestionScreen from '../screens/Students/QuizQuestionScreen';
import QuizBookmarkedQuestionScreen from '../screens/Students/QuizBookmarkedQuestionScreen';
import QuizUnansweredBookmarksScreen from '../screens/Students/QuizUnansweredBookmarksScreen';
import QuizThankYouScreen from '../screens/Students/QuizThankYouScreen';

// Interview Route Screens
import InterviewScreen from '../screens/Students/InterviewScreen';
import InterviewQuestionScreen from '../screens/Students/InterviewQuestionScreen';
import InterviewBookmarksScreen from '../screens/Students/InterviewBookmarksScreen';

// Find Job Screen
import SFindJobScreen from '../screens/SuperAdmin/SFindJobScreen';

// Course Route Screen
import SAllCoursesScreen from '../screens/SuperAdmin/SAllCoursesScreen';
import SCourseDetailScreen from '../screens/SuperAdmin/SCourseDetailScreen';

// Free Video Route Screens
import FreeVideoPlaylistScreen from '../screens/Students/FreeVideoPlaylistScreen';
import PlaylistVideosScreen from '../screens/Students/PlaylistVideosScreen';
import VideoPlayerScreen from '../screens/Students/VideoPlayerScreen';

// Our Team Screen
import OurTeamScreen from '../screens/Students/OurTeamScreen';

// User Preference
import {clearData} from '../api/UserPreference';

// Images
import app_logo from '../assets/images/logo.png';

// Icons
import ic_home_black from '../assets/icons/ic_home_black.png';
import ic_gallery_dr from '../assets/icons/ic_gallery_dr.png';
import ic_notification from '../assets/icons/ic_notification.png';
import ic_logout from '../assets/icons/ic_logout.png';
import ic_student from '../assets/icons/ic_student.png';
import ic_admission from '../assets/icons/ic_admission.png';
import ic_batch from '../assets/icons/ic_batch.png';
import ic_fees from '../assets/icons/ic_fees.png';
import ic_assignment from '../assets/icons/ic_assignment.png';
import ic_attendancedr from '../assets/icons/ic_attendancedr.png';
import ic_interview from '../assets/icons/ic_interview.png';
import ic_quiz from '../assets/icons/ic_quiz.png';
import ic_job_fiend from '../assets/icons/ic_job_fiend.png';
import ic_courses from '../assets/icons/ic_courses.png';
import ic_video from '../assets/icons/ic_video.png';
import ic_contact from '../assets/icons/ic_contact.png';
import ic_team from '../assets/icons/ic_team.png';
import ic_login from '../assets/icons/ic_login.png';
import StudentAttendanceScreen from '../components/SuperAdmin/studentAttendanceScreen';
import MarksReportScreen from '../screens/Students/MarksReportScreen';
import SearchStudent from '../screens/SuperAdmin/SearchStudent';
import MarksReportScreen2 from '../screens/SuperAdmin/MarksReportScreen2';

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

const StudentsNavigator = createStackNavigator(
  {
    SStudents: SStudentsScreen,
    SStudentDetail: SStudentDetailScreen,
    SStudentMarksReports: MarksReportScreen2,
    StudentAttendance: StudentAttendanceScreen,
    AssignmentView: AssignmentViewScreen,
    AssignmentViewer: AssignmentViewerScreen,

    // Enquire: EnquiryNavigator,
  },
  {
    initialRouteName: 'SStudents',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const BatchNavigator = createStackNavigator(
  {
    SBatch: SBatchScreen,
    SBatchDetail: SBatchDetailScreen,
    SStudentDetail: SStudentDetailScreen,
  },
  {
    initialRouteName: 'SBatch',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const AdmissionNavigator = createStackNavigator(
  {
    SAdmission: SAdmissionScreen,
    SBatchDetail: SBatchDetailScreen,
  },
  {
    initialRouteName: 'SAdmission',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const SGalleryNavigator = createStackNavigator(
  {
    SPhotoGallery: SPhotoGalleryScreen,
    SGalleryDetail: SPhotoGalleryDetailScreen,
  },
  {
    initialRouteName: 'SPhotoGallery',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const SAttendanceNavigator = createStackNavigator(
  {
    SAttendance: SAttendanceScreen,
    SAttendanceStudents: SAttendanceStudentsScreen,
  },
  {
    initialRouteName: 'SAttendance',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const SAttendanceSumNavigator = createStackNavigator(
  {
    SAttendanceSum: SAttendanceSummary,
    SAttendanceStudents: SAttendanceStudentsScreen,
  },
  {
    initialRouteName: 'SAttendanceSum',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const SAssignmentSumNavigator = createStackNavigator(
  {
    SAssignmentSum: SAssignmentSummary,
    SAssignmentDetail: SAssignmentDetailScreen,
    SAllAssignments: SAllAssignmentsScreen,
    SStudentDetail: SStudentDetailScreen,
    AssignmentViewer: AssignmentViewerScreen,
  },
  {
    initialRouteName: 'SAssignmentSum',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const SAssignmentsNavigator = createStackNavigator(
  {
    SAssignments: SAssignmentsScreen,
    SAssignmentDetail: SAssignmentDetailScreen,
    AssignmentViewer: AssignmentViewerScreen,
    SStudentDetail: SStudentDetailScreen,
  },
  {
    initialRouteName: 'SAssignments',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const SNotificationNavigator = createStackNavigator(
  {
    SNotification: SNotificationScreen,
  },
  {
    initialRouteName: 'SNotification',
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

const QuizNavigator = createStackNavigator(
  {
    MarksReport: MarksReportScreen,
    Quiz: QuizScreen,
    SearchStudent: SearchStudent,
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
    SFindJob: SFindJobScreen,
    // Enquire: EnquiryNavigator,
  },
  {
    initialRouteName: 'SFindJob',
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

const AllCoursesNavigator = createStackNavigator(
  {
    SAllCourses: SAllCoursesScreen,
    SCourseDetail: SCourseDetailScreen,
  },
  {
    initialRouteName: 'SAllCourses',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

export const SuperAdminLoggedInNavigator = createDrawerNavigator(
  {
    Home: {
      screen: SHomeScreen,
      navigationOptions: setDrawerItemIcon(ic_home_black),
    },
    Batch: {
      screen: BatchNavigator,
      navigationOptions: setDrawerItemIcon(ic_batch),
    },
    Attendance: {
      screen: SAttendanceNavigator,
      navigationOptions: setDrawerItemIcon(ic_attendancedr),
    },
    'Attendance Summary': {
      screen: SAttendanceSumNavigator,
      navigationOptions: setDrawerItemIcon(ic_attendancedr),
    },
    Students: {
      screen: StudentsNavigator,
      navigationOptions: setDrawerItemIcon(ic_student),
    },
    Assignment: {
      screen: SAssignmentsNavigator,
      navigationOptions: setDrawerItemIcon(ic_assignment),
    },
    'Assignment Summary': {
      screen: SAssignmentSumNavigator,
      navigationOptions: setDrawerItemIcon(ic_assignment),
    },
    Registration: {
      screen: AdmissionNavigator,
      navigationOptions: setDrawerItemIcon(ic_admission),
    },
    Notification: {
      screen: SNotificationNavigator,
      navigationOptions: setDrawerItemIcon(ic_notification),
    },

    Payments: {
      screen: SPaymentsScreen,
      navigationOptions: setDrawerItemIcon(ic_fees),
    },
    'Fees Summary': {
      screen: SFeesScreen,
      navigationOptions: setDrawerItemIcon(ic_fees),
    },
    Courses: {
      screen: AllCoursesNavigator,
      navigationOptions: setDrawerItemIcon(ic_courses),
    },
    'Free Videos': {
      screen: FreeVideoNavigator,
      navigationOptions: setDrawerItemIcon(ic_video),
    },
    Quiz: {
      screen: QuizNavigator,
      navigationOptions: setDrawerItemIcon(ic_quiz),
    },
    'Interview Question': {
      screen: InterviewNavigator,
      navigationOptions: setDrawerItemIcon(ic_interview),
    },
    'Jobs Posted': {
      screen: JobNavigator,
      navigationOptions: setDrawerItemIcon(ic_job_fiend),
    },

    Gallery: {
      screen: SGalleryNavigator,
      navigationOptions: setDrawerItemIcon(ic_gallery_dr),
    },

    'Our Team': {
      screen: OurTeamScreen,
      navigationOptions: setDrawerItemIcon(ic_team),
    },
    'Contact Us': {
      screen: ContactScreen,
      navigationOptions: setDrawerItemIcon(ic_contact),
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
