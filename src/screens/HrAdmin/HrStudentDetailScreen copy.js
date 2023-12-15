import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Components
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import PaidModeComponent from '../../components/SuperAdmin/PaidModeComponent';
import AttendanceComponent from '../../components/SuperAdmin/AttendanceComponent';
import FeePlanComponent from '../../components/SuperAdmin/FeePlanComponent';
import CourseInfoComponent from '../../components/SuperAdmin/CourseInfoComponent';
import AssignmentInfoContainer from '../../components/SuperAdmin/AssignmentInfoContainer';
import ExamsComponent from '../../components/SuperAdmin/ExamsComponent';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';

// Images
import ic_user1 from '../../assets/images/ic_user1.jpeg';

// Styles
import basicStyles from '../../styles/BasicStyles';
import SAttendancePopUp from '../../components/SuperAdmin/SPopUpComponent/SAttendancePopUp';

export default class SStudentsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      feePlanData: [
        {id: 1, amount: 10000, proposedDate: '15 Aug 2021'},
        {id: 2, amount: 5000, proposedDate: '15 Sept 2021'},
        {id: 3, amount: 5000, proposedDate: '15 Oct 2021'},
        {id: 4, amount: 5000, proposedDate: '15 Nov 2021'},
        {id: 5, amount: 5000, proposedDate: '15 Dec 2021'},
        {id: 6, amount: 5000, proposedDate: '15 Jan 2022'},
        {id: 7, amount: 5000, proposedDate: '15 Feb 2022'},
        {id: 8, amount: 5000, proposedDate: '15 March 2022'},
      ],
      paidModeData: [
        {
          id: 1,
          amount: 10000,
          fine: 5000,
          pendingFees: 35000,
          payDate: '12-08-2021',
        },
        {
          id: 2,
          amount: 5000,
          fine: 5000,
          pendingFees: 30000,
          payDate: '03-09-2021',
        },
        {
          id: 3,
          amount: 5000,
          fine: 5000,
          pendingFees: 25000,
          payDate: '06-09-2021',
        },
        {
          id: 4,
          amount: 6000,
          fine: 5000,
          pendingFees: 19000,
          payDate: '05-10-2021',
        },
        {
          id: 5,
          amount: 6000,
          fine: 5000,
          pendingFees: 13000,
          payDate: '10-11-2021',
        },
      ],
      courseData: [
        {
          id: 1,
          course: 'Photoshop',
          startOn: '01-09-2021',
          endOn: '23-10-2021',
          status: 'Completed',
        },
        {
          id: 2,
          course: 'Adv. Photoshop',
          startOn: '01-09-2021',
          endOn: '23-10-2021',
          status: 'Running',
        },
        {
          id: 3,
          course: 'HTML-5',
          startOn: '01-09-2021',
          endOn: '23-10-2021',
          status: 'Completed',
        },
        {
          id: 4,
          course: 'Coral Draw',
          startOn: '01-09-2021',
          endOn: '23-10-2021',
          status: 'Completed',
        },
        {
          id: 5,
          course: 'Illustrator',
          startOn: '01-09-2021',
          endOn: '23-10-2021',
          status: 'Dropped',
        },
      ],
      assignmentData: [
        {
          id: 1,
          givenOn: '10-09-2021',
          submittedOn: '13-09-2021',
          faculty: 'Ritesh Sir',
          grades: 'B',
        },
        {
          id: 2,
          givenOn: '10-09-2021',
          submittedOn: '13-09-2021',
          faculty: 'Ritesh Sir',
          grades: 'B',
        },
        {
          id: 3,
          givenOn: '10-09-2021',
          submittedOn: '13-09-2021',
          faculty: 'Ritesh Sir',
          grades: 'B',
        },
        {
          id: 4,
          givenOn: '10-09-2021',
          submittedOn: '13-09-2021',
          faculty: 'Ritesh Sir',
          grades: 'B',
        },
        {
          id: 5,
          givenOn: '10-09-2021',
          submittedOn: '13-09-2021',
          faculty: 'Ritesh Sir',
          grades: 'B',
        },
      ],
      attendanceData: [
        {
          id: 1,
          month: 'Sep',
          course: 'Photoshop(B)',
          classes: 16,
          present: 14,
          absent: 2,
          facultyOff: 3,
        },
        {
          id: 2,
          month: 'Sep',
          course: 'Photoshop(A)',
          classes: 16,
          present: 14,
          absent: 2,
          facultyOff: 3,
        },
        {
          id: 3,
          month: 'Sep',
          course: 'Illustrator',
          classes: 16,
          present: 14,
          absent: 2,
          facultyOff: 3,
        },
        {
          id: 4,
          month: 'Sep',
          course: 'HTML',
          classes: 16,
          present: 14,
          absent: 2,
          facultyOff: 3,
        },
      ],
      examData: [
        {
          id: 1,
          description: 'Design Layout',
          total: '50',
          obtained: '35',
        },
      ],
      showAbsentPopUp: false,
    };
  }

  renderFeePlan = ({item}) => (
    <FeePlanComponent item={item} nav={this.props.navigation} />
  );
  renderPaidMode = ({item}) => (
    <PaidModeComponent item={item} nav={this.props.navigation} />
  );
  renderCourses = ({item}) => (
    <CourseInfoComponent item={item} nav={this.props.navigation} />
  );
  renderAssignments = ({item}) => (
    <AssignmentInfoContainer item={item} nav={this.props.navigation} />
  );
  renderAttendance = ({item}) => (
    <AttendanceComponent
      item={item}
      nav={this.props.navigation}
      handleShowAttendancePop={this.handleShowAttendancePop}
    />
  );
  renderExams = ({item}) => (
    <ExamsComponent item={item} nav={this.props.navigation} />
  );

  handleShowAttendancePop = data => {
    this.setState({showAbsentPopUp: true});
    this.popData = data;
  };

  closePopup = () => {
    this.setState({showAbsentPopUp: false});
  };

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title="Varun Patel"
          nav={this.props.navigation}
          navAction="back"
        />

        <ScrollView style={styles.mainContainer}>
          <Text style={styles.headingText}>Student Info</Text>

          <View style={styles.infoContainer}>
            <Image
              source={ic_user1}
              resizeMode="cover"
              style={styles.userImage}
            />

            <View style={styles.contentContainer}>
              <View style={styles.rowStyle}>
                <Text style={styles.nameStyle}>Varun Patel </Text>
                <Text style={[basicStyles.text, basicStyles.textBold]}>
                  (DL1515)
                </Text>
              </View>

              <View style={styles.rowStyle}>
                <Text style={styles.headText}>Father</Text>
                <Text style={styles.midText}> - </Text>
                <Text style={styles.subTitle}>Mr. Amurtlal Patel</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.headText}>Mobile No.</Text>
                <Text style={styles.midText}> - </Text>
                <Text style={styles.subTitle}>9876543210</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.headText}>Email</Text>
                <Text style={styles.midText}> - </Text>
                <Text style={styles.subTitle}>abc@gmail.com</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.headText}>Course</Text>
                <Text style={styles.midText}> - </Text>
                <Text style={styles.subTitle}>Web Designing</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.headText}>Branch</Text>
                <Text style={styles.midText}> - </Text>
                <Text style={styles.subTitle}>Vidhyadhar Nagar</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.headText}>Ref. By</Text>
                <Text style={styles.midText}> - </Text>
                <Text style={styles.subTitle}>Saurav Patel</Text>
              </View>
            </View>
          </View>

          <View style={styles.feePlanContainer}>
            <Text style={[styles.headingText, basicStyles.marginBottomHalf]}>
              Fee Detail
            </Text>

            <View style={[styles.rowStyle, basicStyles.paddingHalfHorizontal]}>
              <Text style={styles.midText2}>Total Fee : Rs.45000</Text>
              <Text style={styles.subTitle2}>Discount : Rs.0</Text>
            </View>
          </View>

          {/* <View style={styles.feePlanContainer}>
            <Text style={[styles.headingText, basicStyles.marginBottomHalf]}>
              Fee Plan
            </Text>

            <View style={[styles.rowStyle, basicStyles.paddingHalfHorizontal]}>
              <Text style={styles.serialText}>Sr No.</Text>
              <Text style={styles.midText2}>Amount</Text>
              <Text style={styles.subTitle2}>Proposed Date</Text>
            </View>

            <FlatList
              nestedScrollEnabled={true}
              data={this.state.feePlanData}
              renderItem={this.renderFeePlan}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.feePlanContent}
            />
          </View> */}

          <View style={styles.paidModeContainer}>
            <Text style={[styles.headingText, basicStyles.marginBottomHalf]}>
              Paid Mode
            </Text>

            <View
              style={[
                styles.rowStyle,
                // basicStyles.paddingHalfHorizontal,
                basicStyles.justifyBetween,
              ]}>
              <Text
                style={[
                  styles.serialText,
                  {flex: 0, width: wp(8.5), textAlign: 'left'},
                ]}>
                SrNo
              </Text>
              <Text
                style={[
                  styles.midText2,
                  {flex: 0, width: wp(12.5), textAlign: 'left'},
                ]}>
                Amount
              </Text>
              <Text
                style={[
                  styles.midText2,
                  {
                    flex: 0,
                    width: wp(8.5),
                    textAlign: 'center',
                    paddingLeft: wp(1),
                  },
                ]}>
                Fine
              </Text>
              <Text
                style={[
                  styles.midText2,
                  {
                    flex: 0,
                    width: wp(16),
                    textAlign: 'center',
                    paddingLeft: wp(4),
                  },
                ]}>
                Rec No.
              </Text>
              <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
                Pending
              </Text>
              <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
                Pay Date
              </Text>
            </View>

            <FlatList
              nestedScrollEnabled={true}
              data={this.state.paidModeData}
              renderItem={this.renderPaidMode}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.feePlanContent}
            />
          </View>

          <View style={styles.paidModeContainer}>
            <Text style={[styles.headingText, basicStyles.marginBottomHalf]}>
              Course Info
            </Text>

            <View
              style={[
                styles.rowStyle,
                // basicStyles.paddingHalfHorizontal,
                basicStyles.justifyBetween,
              ]}>
              <Text style={[styles.serialText, {flex: 0, textAlign: 'center'}]}>
                SrNo
              </Text>
              <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
                Subject
              </Text>
              <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
                Start On
              </Text>
              <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
                End On
              </Text>
            </View>

            <FlatList
              nestedScrollEnabled={true}
              data={this.state.courseData}
              renderItem={this.renderCourses}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.feePlanContent}
            />
          </View>

          <View style={styles.paidModeContainer}>
            <Text style={[styles.headingText, basicStyles.marginBottomHalf]}>
              Assignment
            </Text>

            <View
              style={[
                styles.rowStyle,
                // basicStyles.paddingHalfHorizontal,
                basicStyles.justifyBetween,
              ]}>
              <Text
                style={[
                  styles.serialText,
                  {
                    flex: 0,
                    width: wp(8),
                    textAlign: 'center',
                    marginLeft: wp(1),
                  },
                ]}>
                SrNo
              </Text>
              <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
                Given On
              </Text>
              <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
                Submit On
              </Text>
              <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
                Faculty
              </Text>
              <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
                Grades
              </Text>
            </View>

            <FlatList
              nestedScrollEnabled={true}
              data={this.state.assignmentData}
              renderItem={this.renderAssignments}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.feePlanContent}
            />
          </View>

          <View style={styles.paidModeContainer}>
            <Text style={[styles.headingText, basicStyles.marginBottomHalf]}>
              Attendance
            </Text>

            <View
              style={[
                styles.rowStyle,
                // basicStyles.paddingHalfHorizontal,
                basicStyles.justifyBetween,
              ]}>
              <Text
                style={[
                  styles.serialText,
                  {flex: 0, width: wp(4), textAlign: 'left'},
                ]}>
                Sr
              </Text>
              <Text
                style={[
                  styles.midText2,
                  {flex: 0, width: wp(11.5), textAlign: 'left'},
                ]}>
                Month
              </Text>
              <Text
                style={[
                  styles.midText2,
                  {
                    flex: 0,
                    width: wp(11.5),
                    textAlign: 'center',
                  },
                ]}>
                Subject
              </Text>
              <Text
                style={[
                  styles.midText2,
                  {
                    flex: 0,
                    width: wp(12),
                    textAlign: 'center',
                  },
                ]}>
                Classes
              </Text>
              <Text
                style={[
                  styles.midText2,
                  {
                    flex: 0,
                    width: wp(12),
                    textAlign: 'center',
                  },
                ]}>
                Present
              </Text>
              <Text
                style={[
                  styles.midText2,
                  {
                    flex: 0,
                    width: wp(12),
                    textAlign: 'center',
                  },
                ]}>
                Absent
              </Text>
              <Text
                style={[
                  styles.midText2,
                  {
                    flex: 0,
                    width: wp(12),
                    textAlign: 'center',
                  },
                ]}>
                Faculty
              </Text>
            </View>

            <FlatList
              nestedScrollEnabled={true}
              data={this.state.attendanceData}
              renderItem={this.renderAttendance}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.feePlanContent}
            />
          </View>

          <View style={styles.examContainer}>
            <Text style={[styles.headingText, basicStyles.marginBottomHalf]}>
              Exam
            </Text>

            <View
              style={[
                styles.rowStyle,
                // basicStyles.paddingHalfHorizontal,
                basicStyles.justifyBetween,
              ]}>
              <Text style={[styles.serialText, {flex: 0, textAlign: 'center'}]}>
                SrNo
              </Text>
              <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
                Description
              </Text>
              <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
                Total
              </Text>
              <Text style={[styles.midText2, {flex: 1, textAlign: 'center'}]}>
                Obtained
              </Text>
            </View>

            <FlatList
              nestedScrollEnabled={true}
              data={this.state.examData}
              renderItem={this.renderExams}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.feePlanContent}
            />
          </View>
        </ScrollView>
        {this.state.showAbsentPopUp && (
          <SAttendancePopUp
            closePopup={this.closePopup}
            nav={this.props.navigation}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  mainContainer: {
    flex: 1,
    padding: wp(2),
  },

  headingText: {
    fontSize: wp(4.8),
    fontWeight: '700',
  },

  buttonStyle: {
    backgroundColor: '#1d99d2',
    width: wp(40),
    alignSelf: 'center',
    marginTop: hp(4),
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(1),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp(4),
  },
  textStyle: {
    padding: wp(3),
    fontSize: wp(4.8),
    fontWeight: '700',
  },

  // Student Style

  infoContainer: {
    flexDirection: 'row',
    marginTop: wp(2),
    paddingBottom: wp(3),
    borderBottomWidth: 1.1,
    borderColor: '#999',
  },
  userImage: {
    width: hp(16),
    aspectRatio: 1 / 1,
    borderRadius: wp(1),
  },
  contentContainer: {
    // borderWidth: 2,
    flex: 1,
    marginHorizontal: wp(2),
  },
  nameStyle: {
    color: '#1d99d2',
    fontSize: wp(5),
    fontWeight: '700',
  },
  headText: {
    flex: 1,
    color: '#333',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  midText: {
    color: '#333',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  subTitle: {
    flex: 2,
    color: '#333',
    fontSize: wp(3),

    textAlign: 'right',
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Fee Plan
  feePlanContent: {
    marginTop: wp(1),
  },
  feePlanContainer: {
    marginTop: wp(3),
    padding: wp(2),
    backgroundColor: '#f1f2f2',
    borderRadius: wp(2),
  },
  serialText: {
    flex: 1,
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: '700',
    // marginLeft: wp(2),
  },
  midText2: {
    // flex: 2,
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  subTitle2: {
    flex: 1.2,
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: '700',
    textAlign: 'right',
  },

  // Paid Mode
  paidModeContainer: {
    marginTop: wp(3),
    padding: wp(2),
    backgroundColor: '#f1f2f2',
    borderRadius: wp(2),
  },
  examContainer: {
    marginTop: wp(3),
    marginBottom: wp(5),
    padding: wp(2),
    backgroundColor: '#f1f2f2',
    borderRadius: wp(2),
  },
  // Exam
});
