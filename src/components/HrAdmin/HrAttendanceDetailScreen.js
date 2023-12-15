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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NetInfo from '@react-native-community/netinfo';
import offline from '../../assets/icons/internetConnectionState.gif';
import HeaderComponent from '../../components/HeaderComponent';
import MonthPicker from 'react-native-month-picker';
import moment from 'moment';
import AttendanceComp from '../../components/AttendacnceComponent';
import {Datalist} from '../../screens/Students/data';
import HrStudentAttendance from '../StudentAttendanComp';
import {KEYS, getData} from '../../api/UserPreference';
import {BASE_URL} from '../../api/ApiInfo';

export default class HrAttendanceDetailScreen extends Component {
  constructor() {
    super();
    this.state = {
      connectionState: true,
      isMonthPickerVisible: false,
      selectedMonth: new Date(), // Default selected month
      totalPresent: 0,
      totalAbsent: 0,
      facultyTotalAbsent: 0,
      attendanceData: [],
    };
  }
  componentDidMount() {
    this.fetchAttendance();
  }
  keyExtractor = (item, index) => index.toString();

  itemSeparator = () => <View style={styles.separator} />;
  toggleMonthPicker = () => {
    this.setState({isMonthPickerVisible: !this.state.isMonthPickerVisible});
  };

  handleMonthChange = newDate => {
    this.setState({
      selectedMonth: newDate,
      isMonthPickerVisible: false,
    });
  };
  renderItem = ({item}) => <HrStudentAttendance item={item} />;
  fetchAttendance = async () => {
    const {selectedMonth} = this.state;
    const userInfo = await getData(KEYS.USER_INFO);

    const {s_id} = userInfo;
    const studentId = s_id; // Replace with actual student ID

    try {
      const formattedMonth = moment(selectedMonth).format('MM/YYYY');
      const params = {
        studentId,
        month: formattedMonth,
      };

      // Make API call using fetch or your preferred method
      const response = await fetch(BASE_URL + 'getStudentAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any required headers here
        },
        body: JSON.stringify(params),
      });
      console.log('====================================');
      console.log('response');
      console.log('====================================');

      const responseData = await response.json();

      // Process the response data
      if (responseData.success) {
        const {totalPresent, totalAbsent, facultyTotalAbsent, data} =
          responseData;

        // Update your state with the fetched attendance data
        this.setState({
          totalPresent,
          totalAbsent,
          facultyTotalAbsent,
          attendanceData: data, // Store the attendance data in state
        });
      } else {
        // Handle error cases
      }
    } catch (error) {
      console.error(error);
    }
  };
  render() {
    const {totalPresent, totalAbsent, facultyTotalAbsent, attendanceData} =
      this.state;
    return (
      <SafeAreaView style={styles.container}>
        <HeaderComponent
          title="Student Attendance "
          nav={this.props.navigation}
          //     navAction="back"
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
              {/* <View style={styles.headerRowItem}>
                <Text style={styles.headerText}>Total Days</Text>
                <Text style={styles.headerValue}>30</Text>
              </View> */}
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
            <FlatList
              data={Datalist.data}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.itemSeparator}
              contentContainerStyle={styles.listContentContainer}
              showsVerticalScrollIndicator={false}
            />
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
