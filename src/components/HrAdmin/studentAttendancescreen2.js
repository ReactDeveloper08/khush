import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NetInfo from '@react-native-community/netinfo';
import offline from '../../assets/icons/internetConnectionState.gif';
import HeaderComponent from '../HeaderComponent';
import MonthPicker from 'react-native-month-picker';
import moment from 'moment';
import {Datalist} from './data';
import AttendanceComp from '../AttendacnceComponent';
import {BASE_URL, makeRequest} from '../../api/ApiInfo';
import {getData, KEYS} from '../../api/UserPreference';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class StudentAttendanceScreen2 extends Component {
  constructor() {
    super();
    this.state = {
      connectionState: true,
      isMonthPickerVisible: false,
      selectedMonth: new Date(), // Default selected month
      totalPresent: 0,
      totalAbsent: 0,
      facultyTotalAbsent: 0,
      totalDays: 0,
      attendanceData: [],
    };
  }

  componentDidMount() {
    this.fetchAttendance2();
  }

  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;

  toggleMonthPicker = () => {
    this.setState({isMonthPickerVisible: !this.state.isMonthPickerVisible});
  };

  handleMonthChange = newDate => {
    this.setState(
      {
        selectedMonth: newDate,
        isMonthPickerVisible: false,
      },
      () => {
        this.fetchAttendance2(); // Fetch attendance data with the new selected month
      },
    );
  };

  renderItem = ({item}) => {
    return (
      // <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <AttendanceComp item={item} />
      // </ScrollView>
    );
  };

  fetchAttendance2 = async () => {
    const {selectedMonth} = this.state;
    const studentId = await this.props.navigation.getParam('studentId', null);
    console.log('####', studentId);
    const student_id = studentId;
    try {
      this.setState({isLoading: true});

      const formattedMonth = moment(selectedMonth).format('MMM YYYY');
      const params = {
        student_id: student_id,
        month: formattedMonth,
      };
      console.log('++++', params);

      const response = await makeRequest(
        BASE_URL + 'getStudentAttendance',
        params,
        true,
      );

      // Update state with fetched attendance data
      this.setState({
        totalPresent: response.totalPresent,
        totalDays: response.totalDays,
        totalAbsent: response.totalAbsent,
        facultyTotalAbsent: response.facultyTotalAbsent,
        attendanceData: response.data,
        isLoading: false,
      });
    } catch (error) {
      // Handle errors here
      this.setState({isLoading: false});
    }
  };

  render() {
    const {
      totalPresent,
      totalAbsent,
      facultyTotalAbsent,
      attendanceData,
      totalDays,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title="Attendance Detail"
          nav={this.props.navigation}
          navAction="back"
        />

        {this.state.connectionState && (
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={this.toggleMonthPicker}>
              <Text style={styles.monthText}>
                {moment(this.state.selectedMonth).format('MMMM YYYY')}
              </Text>
              <Image
                source={require('../../assets/icons/calendar.png')}
                style={styles.calendarIcon}
              />
            </TouchableOpacity>

            {/* Custom Dropdown */}
            <Modal
              visible={this.state.isMonthPickerVisible}
              transparent={true}
              animationType="slide">
              <View style={styles.dropdownModal}>
                <View style={styles.monthPickerContainer}>
                  <MonthPicker
                    selectedDate={this.state.selectedMonth}
                    onMonthChange={this.handleMonthChange}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={this.toggleMonthPicker}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View style={styles.headerRow}>
              <View style={styles.headerRowItem}>
                <Text style={styles.headerText}>Total Days</Text>
                <Text style={styles.headerValue}>{totalDays}</Text>
              </View>
              <View style={styles.headerRowItem}>
                <Text style={styles.headerText}>Present</Text>
                <Text style={styles.headerValue}>{totalPresent}</Text>
              </View>
              <View style={styles.headerRowItem}>
                <Text style={styles.headerText}>Absent</Text>
                <Text style={styles.headerValue}>{totalAbsent}</Text>
              </View>
              <View style={styles.headerRowItem}>
                <Text style={styles.headerText}>Faculty Absent</Text>
                <Text style={styles.headerValue}>{facultyTotalAbsent}</Text>
              </View>
            </View>
            {/* code */}
            {/* <KeyboardAwareScrollView style={{flex: 1, marginBottom: wp(2)}}> */}
            <FlatList
              data={attendanceData}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContentContainer}
              showsVerticalScrollIndicator={false}
            />
            {/* </KeyboardAwareScrollView> */}
          </View>
        )}

        {!this.state.connectionState && (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp(2),
    marginTop: 10,
  },
  container2: {
    backgroundColor: '#ddd8',
    borderRadius: wp(1.2),
    marginTop: wp(2),
    padding: wp(0.5),
    marginBottom: wp(1),
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(1),
    paddingHorizontal: wp(3),
    flex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  monthText: {
    flex: 1,
  },
  calendarIcon: {
    width: 20,
    height: 20,
  },
  dropdownModal: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  monthPickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#27a7e2',
    padding: wp(2),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  headerRowItem: {
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: wp(3),
  },
  headerValue: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: 'bold',
  },
  infoHeadTextStyle: {
    color: '#333',
    fontSize: wp(2.5),
  },
  infoHeadStyle: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: wp(3),
    textTransform: 'capitalize',
  },
  punchinout: {
    flex: 1,
    paddingLeft: wp(2),
    //     alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
  },
  homeContainer: {
    flex: 1,
  },
  homeTextContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: wp(3),
  },
  homeText: {
    color: '#fff',
    fontSize: wp(3),
    fontWeight: '400',
  },
  homeTextStyle: {
    color: '#333',
    fontSize: wp(3),
    fontWeight: '400',
  },
  homeTextStyle2: {
    color: '#333',
    fontSize: wp(4),
    fontWeight: '700',
  },
  icStyle: {
    height: hp(4),
    aspectRatio: 1 / 1,
  },
  textCenter: {
    textAlign: 'center',
    color: '#fff',
  },
  cakeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(4),
    margin: wp(2),
  },
  listContainers: {
    borderTopWidth: 0.5,
    borderTopColor: '#ccc8',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc8',
  },
  tileContainer: {
    borderWidth: 0.5,
    borderColor: '#0077a2',
    width: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: wp(4),
    height: hp(20),
  },
  tileIcon: {
    height: wp(10),
    aspectRatio: 1 / 1,
    marginBottom: wp(2),
  },
  separator: {
    height: hp(0.5),
  },
});
