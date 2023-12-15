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

// Icons
import ic_delete from '../../assets/icons/ic_delete.png';
import ic_eyeView from '../../assets/icons/ic_eyeView.png';

const HrAssignmentsComponent = props => {
  const {item, backgroundColor, fetchAssignments} = props;
  const {
    branchName,
    title,
    courseName,
    givenOn,
    faculty,
    submittedBy,
    notSubmitted,
    isUpdated,
    assignmentId,
    batchCode,
  } = item;

  const handleViewAssignment = () => {
    props.nav.push('SAssignmentDetail', {
      assignmentInfo: item,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor: backgroundColor}]}
      onPress={handleViewAssignment}>
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.rowStyle,
            basicStyles.justifyBetween,
            basicStyles.marginBottomHalf,
          ]}>
          <Text style={styles.nameStyle}>{title} </Text>
          {/* <Text
            style={[
              basicStyles.text,
              basicStyles.textBold,
              {color: '#111', flex: 1},
            ]}>
            ({branch})
          </Text> */}

          {/* <Text style={styles.statusText}>{givenDate} </Text> */}
        </View>

        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Course</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{courseName}</Text>
        </View>

        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Batch</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{batchCode}</Text>
        </View>

        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Branch</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{branchName}</Text>
        </View>

        {/* <View style={styles.rowStyle}>
          <Text style={styles.headText}>Branch</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{branch}</Text>
        </View> */}
        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Faculty</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{faculty}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Given On</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{givenOn}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Submitted</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{submittedBy}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Not Submitted</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{notSubmitted}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HrAssignmentsComponent;

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
    textTransform: 'capitalize',
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
    fontSize: wp(3.8),
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
  buttonsContainer: {
    flexDirection: 'row',
  },
  buttonStyle: {
    backgroundColor: '#333',
    padding: wp(1),
    borderRadius: wp(5),
    marginLeft: wp(4),

    alignItems: 'center',
    justifyContent: 'center',
  },
});
