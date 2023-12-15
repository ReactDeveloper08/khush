/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
// Styles

import ic_user1 from '../../assets/images/ic_user1.jpeg';

const StudentSummaryComponent = props => {
  const {item, itemIndex} = props;
  const {
    studentId,
    studentImage,
    studentEnroll,
    courseName,
    studentName,
    mobile,
    branchName,
    studentStatus,
  } = item;

  const handleStudent = () => {
    props.nav.push('SStudentDetail', {stInfo: item});
  };
  const handleAttendance = () => {
    props.nav.push('StudentAttendance', {studentId});
  };
  const handleNav = () => {
    props.nav.push('SStudentMarksReports', {studentId});
  };
  const backgroundColor =
    '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6) + 55;
  return (
    <TouchableOpacity
      style={[
        styles.container,
        // {backgroundColor: itemIndex % 2 === 0 ? '#2629eb55' : '#267feb55'},
        {backgroundColor},
      ]}
      onPress={handleStudent}>
      <View style={[styles.mainContainer]}>
        {studentImage ? (
          <Image
            source={{uri: studentImage}}
            resizeMode="cover"
            style={styles.userImage}
          />
        ) : (
          <Image
            source={ic_user1}
            resizeMode="cover"
            style={styles.userImage}
          />
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.nameStyle}>{studentName}</Text>

          <Text style={styles.title}>
            Enroll No. -{' '}
            <Text style={[styles.subTitle, {textTransform: 'uppercase'}]}>
              {studentEnroll}
            </Text>
          </Text>
          <Text style={styles.title}>
            Course - <Text style={styles.subTitle}>{courseName}</Text>
          </Text>
          <Text style={styles.title}>
            Mobile No. - <Text style={styles.subTitle}>{mobile}</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={{marginTop: wp(-15), marginRight: wp(-7)}}
          onPress={handleNav}>
          <Image
            source={require('../../assets/icons/files.png')}
            style={{width: 25, height: 25}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleAttendance}
          style={{marginTop: wp(13)}}>
          <Image
            source={require('../../assets/icons/attendance.png')}
            style={{width: 25, height: 25}}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default StudentSummaryComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e7e8e9',
    borderRadius: wp(2),
    padding: wp(2),
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: hp(1.2),
  },
  userImage: {
    width: hp(10),
    aspectRatio: 1 / 1,
    borderRadius: wp(1),
  },
  contentContainer: {
    // borderWidth: 2,
    flex: 1,
    marginHorizontal: wp(2),
  },
  nameStyle: {
    color: '#111',
    fontSize: wp(3.7),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  title: {
    marginLeft: wp(2),
    color: '#111',
    fontSize: wp(3.2),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  subTitle: {
    color: '#111',
    fontSize: wp(3.5),
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  notificationBody: {
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
    paddingBottom: hp(2),
    flexDirection: 'row',
  },
  message: {
    flex: 1,
    color: '#5a5a5a',
    fontSize: wp(3.2),
    textAlign: 'justify',
  },
});
