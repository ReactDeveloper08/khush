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

const RegistrationInfoComponent = props => {
  const {item, backgroundColor} = props;
  const {
    studentName,
    studentMobile,
    courseName,
    branchName,
    registerDate,
    referredBy,
    studentEnroll,
  } = item;

  const handleStudent = () => {
    // props.nav.push('SBatchDetail');
  };

  return (
    <View
      style={[styles.container, {backgroundColor: backgroundColor}]}
      onPress={handleStudent}>
      <View style={styles.contentContainer}>
        <View style={styles.rowStyle}>
          <Text style={styles.nameStyle}>{studentName} </Text>
          <Text
            style={[
              styles.midText,

              {color: '#111', textTransform: 'uppercase', marginLeft: wp(0)},
            ]}>
            ({studentEnroll})
          </Text>
          {/* <Text style={styles.statusText}>{batchType} </Text> */}
        </View>

        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Mobile</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{studentMobile}</Text>
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
        <View style={styles.rowStyle}>
          <Text style={styles.headText}>Date</Text>
          <Text style={styles.midText}> - </Text>
          <Text style={styles.subTitle}>{registerDate}</Text>
        </View>
        {referredBy ? (
          <View style={styles.rowStyle}>
            <Text style={styles.headText}>Referred By</Text>
            <Text style={styles.midText}> - </Text>
            <Text style={styles.subTitle}>{referredBy}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default RegistrationInfoComponent;

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
    color: '#fff',
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
    fontSize: wp(3.5),
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
    textTransform: 'capitalize',
  },
});
