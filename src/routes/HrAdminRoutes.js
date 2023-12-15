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

// Home Screens
import HrHomeScreen from '../screens/HrAdmin/HrHomeScreen';

// Student Screens
import HrStudentsScreen from '../screens/HrAdmin/HrStudentsScreen';
import HrStudentDetailScreen from '../screens/HrAdmin/HrStudentDetailScreen';

// Attendance Screens
import HrAttendanceScreen from '../screens/HrAdmin/HrAttendanceScreen';
import HrAttendanceStudentsScreen from '../screens/HrAdmin/HrAttendanceStudentsScreen';

// Batch Screens
import HrBatchScreen from '../screens/HrAdmin/HrBatchScreen';
import HrBatchDetailScreen from '../screens/HrAdmin/HrBatchDetailScreen';

// Contact Screen
import ContactScreen from '../screens/Students/ContactScreen';

// Assignments Screens
import HrAssignmentsScreen from '../screens/HrAdmin/HrAssignmentsScreen';
import HrAllAssignmentsScreen from '../screens/HrAdmin/HrAllAssignmentsScreen';
import HrAssignmentSummary from '../screens/HrAdmin/HrAssignmentSummary';
import HrAttendanceSummary from '../screens/HrAdmin/HrAttendanceSummary';
import HrAssignmentViewScreen from '../screens/HrAdmin/HrAssignmentViewScreen';
import HrAssignmentDetailScreen from '../screens/HrAdmin/HrAssignmentDetailScreen';
import HrAddAssignmentScreen from '../screens/HrAdmin/HrAddAssignmentScreen';
import HrUpdateAssignmentScreen from '../screens/HrAdmin/HrUpdateAssignmentScreen';
import AssignmentViewerScreen from '../screens/Students/AssignmentViewerScreen';

// Admission Screens
import HrAdmissionScreen from '../screens/HrAdmin/HrAdmissionScreen';

// Payments Screens
import HrPaymentsScreen from '../screens/HrAdmin/HrPaymentsScreen';

// Fees Screens
import HrFeesScreen from '../screens/HrAdmin/HrFeesScreen';
import HrCollectionDetailScreen from '../screens/HrAdmin/HrCollectionDetailScreen';

// Notification Screens
import HrNotificationScreen from '../screens/HrAdmin/HrNotificationScreen';

// Gallery Screens
import HrPhotoGalleryScreen from '../screens/HrAdmin/HrPhotoGalleryScreen';
import HrPhotoGalleryDetailScreen from '../screens/HrAdmin/HrPhotoGalleryDetailScreen';

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
import ic_student from '../assets/icons/ic_student.png';
import ic_attendanceDr from '../assets/icons/ic_attendancedr.png';
import ic_admission from '../assets/icons/ic_admission.png';
import ic_batch from '../assets/icons/ic_batch.png';
import ic_fees from '../assets/icons/ic_fees.png';
import ic_idcard from '../assets/icons/ic_idcard.png';
import ic_attendancedr from '../assets/icons/ic_attendancedr.png';
import ic_login from '../assets/icons/ic_login.png';
import StudentAttendanComp from '../components/StudentAttendanComp';
import HrStudentAttendance from '../components/StudentAttendanComp';
import HrAttendanceDetailScreen from '../components/HrAdmin/HrAttendanceDetailScreen';
import StudentAttendanceScreen2 from '../components/HrAdmin/studentAttendancescreen2';
import MarksReportScreen from '../screens/Students/MarksReportScreen';
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

const AttendanceNavigator = createStackNavigator(
  {
    HrAttendance: HrAttendanceScreen,
    HrAttendanceStudents: HrAttendanceStudentsScreen,
  },
  {
    initialRouteName: 'HrAttendance',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const HrStudentsNavigator = createStackNavigator(
  {
    HrStudent: HrStudentsScreen,
    HrStudentDetail: HrStudentDetailScreen,
    HrStudentReportmarks: MarksReportScreen2,
    HrStudentAttendance: StudentAttendanceScreen2,
    AssignmentView: HrAssignmentViewScreen,
    AssignmentViewer: AssignmentViewerScreen,
  },
  {
    initialRouteName: 'HrStudent',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const HrBatchNavigator = createStackNavigator(
  {
    HrBatch: HrBatchScreen,
    HrBatchDetail: HrBatchDetailScreen,
    HrStudentDetail: HrStudentDetailScreen,
  },
  {
    initialRouteName: 'HrBatch',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const HrAssignmentsNavigator = createStackNavigator(
  {
    HrAssignments: HrAssignmentsScreen,
    HrAssignmentDetail: HrAssignmentDetailScreen,
    HrAddAssignment: HrAddAssignmentScreen,
    HrStudentDetail: HrStudentDetailScreen,
    HrUpdateAssignment: HrUpdateAssignmentScreen,
    AssignmentViewer: AssignmentViewerScreen,
  },
  {
    initialRouteName: 'HrAssignments',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const HrGalleryNavigator = createStackNavigator(
  {
    HrPhotoGallery: HrPhotoGalleryScreen,
    HrPhotoGalleryDetail: HrPhotoGalleryDetailScreen,
  },
  {
    initialRouteName: 'HrPhotoGallery',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const HrNotificationNavigator = createStackNavigator(
  {
    HrNotification: HrNotificationScreen,
  },
  {
    initialRouteName: 'HrNotification',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const HrAdmissionNavigator = createStackNavigator(
  {
    HrAdmission: HrAdmissionScreen,
    HrBatchDetail: HrBatchDetailScreen,
  },
  {
    initialRouteName: 'HrAdmission',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const HrFeesNavigator = createStackNavigator(
  {
    HrFees: HrFeesScreen,
    HrCollectionDetail: HrCollectionDetailScreen,
  },
  {
    initialRouteName: 'HrFees',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const HrAttendanceSumNavigator = createStackNavigator(
  {
    HrAttendanceSum: HrAttendanceSummary,
    HrAttendanceStudents: HrAttendanceStudentsScreen,
    HrAttendanceDetailScreen: HrAttendanceDetailScreen,
  },
  {
    initialRouteName: 'HrAttendanceSum',
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const HrAssignmentSumNavigator = createStackNavigator(
  {
    HrAssignmentSum: HrAssignmentSummary,
    HrAssignmentDetail: HrAssignmentDetailScreen,
    HrAllAssignments: HrAllAssignmentsScreen,
    HrStudentDetail: HrStudentDetailScreen,
    AssignmentViewer: AssignmentViewerScreen,
  },
  {
    initialRouteName: 'HrAssignmentSum',
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

export const HrAdminLoggedInNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HrHomeScreen,
      navigationOptions: setDrawerItemIcon(ic_home_black),
    },
    Batch: {
      screen: HrBatchNavigator,
      navigationOptions: setDrawerItemIcon(ic_batch),
    },
    Attendance: {
      screen: AttendanceNavigator,
      navigationOptions: setDrawerItemIcon(ic_attendanceDr),
    },
    'Attendance Summary': {
      screen: HrAttendanceSumNavigator,
      navigationOptions: setDrawerItemIcon(ic_attendanceDr),
    },
    Students: {
      screen: HrStudentsNavigator,
      navigationOptions: setDrawerItemIcon(ic_student),
    },
    Assignments: {
      screen: HrAssignmentsNavigator,
      navigationOptions: setDrawerItemIcon(ic_assignment),
    },
    'Assignment Summary': {
      screen: HrAssignmentSumNavigator,
      navigationOptions: setDrawerItemIcon(ic_assignment),
    },
    Registration: {
      screen: HrAdmissionNavigator,
      navigationOptions: setDrawerItemIcon(ic_admission),
    },
    'Fees Summary': {
      screen: HrFeesNavigator,
      navigationOptions: setDrawerItemIcon(ic_fees),
    },
    Payments: {
      screen: HrPaymentsScreen,
      navigationOptions: setDrawerItemIcon(ic_fees),
    },
    Notification: {
      screen: HrNotificationNavigator,
      navigationOptions: setDrawerItemIcon(ic_notification),
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
      screen: HrGalleryNavigator,
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
