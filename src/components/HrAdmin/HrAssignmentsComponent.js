import React from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableHighlight,
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
import ic_updateAssignment from '../../assets/icons/ic_updateAssignment.png';

const HrAssignmentsComponent = props => {
  const {item, backgroundColor, fetchAssignments, handleRemoveAssignment} =
    props;

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

  const handleUpdateAssignment = () => {
    props.nav.navigate('HrUpdateAssignment', {
      assignmentInfo: item,
      fetchAssignment: fetchAssignments,
    });
  };

  const handleViewAssignment = () => {
    props.nav.navigate('HrAssignmentDetail', {
      assignmentInfo: item,
    });
  };

  const handleDeleteProceed = async () => {
    await handleRemoveAssignment(assignmentId);
  };

  const handleDeleteAssignment = () => {
    Alert.alert(
      'Delete Assignment',
      'Are you sure, You want delete this assignment?',
      [
        {text: 'NO', style: 'cancel'},
        {text: 'YES', onPress: handleDeleteProceed},
      ],
      {
        cancelable: false,
      },
    );
  };

  return (
    <TouchableHighlight
      style={[styles.container, {backgroundColor: backgroundColor}]}
      onPress={handleViewAssignment}
      underlayColor="transparent">
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.rowStyle,
            basicStyles.justifyBetween,
            basicStyles.marginBottomHalf,
          ]}>
          <Text style={styles.nameStyle}>{title} </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.buttonStyle,
                {backgroundColor: isUpdated ? 'green' : '#cc8400'},
              ]}
              onPress={handleUpdateAssignment}>
              <Image
                source={ic_updateAssignment}
                resizeMode="cover"
                style={basicStyles.iconColumn}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteAssignment}
              style={[styles.buttonStyle, {backgroundColor: '#eb0000'}]}>
              <Image
                source={ic_delete}
                resizeMode="cover"
                style={basicStyles.iconColumn}
              />
            </TouchableOpacity>
          </View>

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
    </TouchableHighlight>
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
    flex: 1,
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
    zIndex: 5,
  },
});
