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

import basicStyles from '../../styles/BasicStyles';

const CourseInfoComponent = props => {
  const {item} = props;

  const {
    id,
    batchCode,
    subject,
    faculty,
    status,
    classes,
    StartDate,
    endDate,
    dropDate,
    dropReason,
    studentPresent,
    studentAbsent,
    facultyAbsent,
    batchAssignment,
    totalClasses,
    studentId,
    batchTime,
  } = item;

  let bgColor = '#f1f2f2';

  if (status === 'Running') {
    bgColor = '#9996';
  } else if (status === 'Dropped') {
    bgColor = '#ff000060';
  }
  const handleViewAssignment = () => {
    props.nav.push('AssignmentView', {stInfo: item});
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.contentContainer}>
        <View style={[styles.rowStyle]}>
          <Text style={styles.nameStyle}>
            {batchCode}{' '}
            <Text
              style={{
                color: '#444',
                fontSize: wp(2.8),
                fontWeight: 'bold',
                // marginTop: wp(-10),
              }}>
              ({batchTime})
            </Text>
          </Text>
        </View>

        <Text style={[styles.subTitle, basicStyles.textBold, {color: '#666'}]}>
          {subject}
        </Text>
      </View>

      <View style={[styles.contentContainer, {marginTop: wp(2)}]}>
        <View style={styles.rowStyle}>
          {/* <Text style={[styles.headText, {marginLeft: wp(0)}]}>Faculty</Text> */}
          {/* <Text style={styles.midText}> - </Text> */}
          <Text
            style={{color: '#1d99d2', fontSize: wp(2.8), fontWeight: '700'}}>
            {faculty}
          </Text>
        </View>

        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Total Classes</Text>
          <Text style={styles.midText}>- </Text>
          <Text style={styles.midText}>{totalClasses}</Text>
        </View>
      </View>

      <View style={[styles.contentContainer, {marginVertical: wp(2)}]}>
        <View
          style={[
            basicStyles.alignCenter,
            {borderWidth: 0.7, flex: 1, borderColor: '#888'},
          ]}>
          <Text style={[styles.headText, {marginLeft: wp(0)}]}>Present</Text>
          <Text style={styles.subTitle}>{studentPresent}</Text>
        </View>

        <View
          style={[
            basicStyles.alignCenter,
            {borderWidth: 0.7, flex: 1, borderColor: '#888'},
          ]}>
          <Text style={[styles.headText, {marginLeft: wp(0)}]}>Absent</Text>
          <Text style={styles.subTitle}>{studentAbsent}</Text>
        </View>

        <View
          style={[
            basicStyles.alignCenter,
            {borderWidth: 0.7, flex: 1, borderColor: '#888'},
          ]}>
          <Text style={[styles.headText, {marginLeft: wp(0)}]}>
            Faculty Off
          </Text>
          <Text style={styles.subTitle}>{facultyAbsent}</Text>
        </View>

        <TouchableOpacity
          onPress={handleViewAssignment}
          style={[
            basicStyles.alignCenter,
            {borderWidth: 0.7, flex: 1, borderColor: '#888'},
          ]}>
          <Text style={[styles.headText, {marginLeft: wp(0)}]}>
            Assignments
          </Text>
          <Text style={styles.subTitle}>{batchAssignment}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Started On</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{StartDate}</Text>
        </View>

        <View style={styles.rowStyle}>
          <Text style={styles.headText}>End On</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{endDate}</Text>
        </View>
      </View>
    </View>
  );
};

export default CourseInfoComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: wp(2),
    paddingVertical: wp(2),
    // borderWidth: 1,
    padding: wp(1.5),
    margin: wp(0.7),
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
    color: '#000',
    fontSize: wp(3),
    fontWeight: '700',
  },
  contentContainer: {
    // borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginHorizontal: wp(2),
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameStyle: {
    color: '#444',
    fontSize: wp(3.2),
    fontWeight: '700',
  },
  headText: {
    // flex: 1,
    textAlign: 'left',
    color: '#444',
    fontSize: wp(2.8),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  midText: {
    color: '#666',
    fontSize: wp(2.8),
    fontWeight: '700',
    // marginLeft: wp(2),
  },
  subTitle: {
    // flex: 2,
    color: '#666',
    fontSize: wp(2.8),
    textAlign: 'right',
  },
});
