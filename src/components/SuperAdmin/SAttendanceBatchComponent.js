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
import basicStyles from '../../styles/BasicStyles';

const AttendanceBatchComponent = props => {
  const {item, backgroundColor} = props;
  const {
    branchId,
    batchId,
    startedOn,
    endOn,
    batchTime,
    branchName,
    batchType,
    batchStatus,
    courseName,
    totalStudents,
    presentStudents,
    batchCode,
    facultyName,
  } = item;

  const handleStudent = () => {
    props.nav.push('SAttendanceStudents', {
      batchInfo: item,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor: backgroundColor}]}
      onPress={handleStudent}>
      <View style={styles.contentContainer}>
        <View style={styles.rowStyle}>
          <Text style={styles.nameStyle}>{courseName} </Text>
          {/* <Text
            style={[basicStyles.text, basicStyles.textBold, {color: '#111'}]}>
            ({branch})
          </Text> */}
          <Text style={styles.statusText}>{batchStatus} </Text>
        </View>

        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Batch Code</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{batchCode}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Faculty</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{facultyName}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Started On</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{startedOn}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.headText}>End On</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{endOn}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Time</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{batchTime}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Total Students</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{totalStudents}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Students Present</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{presentStudents}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AttendanceBatchComponent;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#e7e8e9',
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
  statusText: {
    textAlign: 'right',
    flex: 1,
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
  },
  contentContainer: {
    // borderWidth: 2,
    flex: 1,
    marginHorizontal: wp(2),
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameStyle: {
    color: '#111',
    fontSize: wp(4),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  headText: {
    flex: 1,
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
    textTransform: 'capitalize',
  },
  midText: {
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
    textTransform: 'capitalize',
  },
  subTitle: {
    flex: 2,
    color: '#444',
    fontSize: wp(3),
    textAlign: 'right',
    textTransform: 'capitalize',
  },
});
