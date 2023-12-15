import React from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Styles
import basicStyles from '../../styles/BasicStyles';

const HrBatchDetailComponent = props => {
  const {item, backgroundColor} = props;
  const {
    studentImage,
    studentEnroll,
    studentName,
    mobile,
    branchName,
    studentStatus,
    ispresent,
    facultyAbsent,
    courseName,
  } = item;

  const handleStudentNavigation = () => {
    props.nav.navigate('HrStudentDetail', {stInfo: item});
  };

  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor: backgroundColor}]}
      onPress={handleStudentNavigation}>
      <View style={styles.mainContainer}>
        <Image
          source={{uri: studentImage}}
          resizeMode="cover"
          style={styles.userImage}
        />

        <View style={styles.contentContainer}>
          <View style={styles.rowStyle}>
            <Text style={styles.nameStyle}>{studentName} </Text>
            <Text
              style={[basicStyles.text, basicStyles.textBold, {color: '#111'}]}>
              ({studentEnroll})
            </Text>
            {/* <Text style={styles.statusText}>{studentStatus} </Text> */}
          </View>

          <View style={styles.rowStyle}>
            <Text style={styles.headText}>Mobile</Text>
            <Text style={styles.midText}> - </Text>
            <Text style={styles.subTitle}>{mobile}</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text style={styles.headText}>Course</Text>
            <Text style={styles.midText}> - </Text>
            <Text style={styles.subTitle}>{courseName}</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text style={styles.headText}>Branch</Text>
            <Text style={styles.midText}> - </Text>
            <Text style={styles.subTitle}>{branchName}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HrBatchDetailComponent;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#e7e8e9',
    borderRadius: wp(2),
    padding: wp(2),
  },
  mainContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // marginBottom: hp(1.2),
  },
  userImage: {
    width: wp(20),
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
    fontSize: wp(3.2),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  headText: {
    flex: 1,
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  midText: {
    color: '#111',
    fontSize: wp(3),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  subTitle: {
    flex: 2,
    color: '#444',
    fontSize: wp(3),
    textAlign: 'right',
  },
});
