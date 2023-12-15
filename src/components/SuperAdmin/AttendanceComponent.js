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
import basicStyles from '../../styles/BasicStyles';

const AttendanceComponent = props => {
  const {item, handleShowAttendancePop} = props;
  const {id, month, course, classes, present, absent, facultyOff} = item;

  const handlePopUp = () => {
    handleShowAttendancePop(item);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.mainContainer,
          basicStyles.alignCenter,
          basicStyles.justifyBetween,
        ]}
        onPress={handlePopUp}>
        <Text style={styles.serialText}>{id}</Text>
        <Text style={[styles.midText2, {flex: 0, width: wp(11.5)}]}>
          {month}
        </Text>
        <Text
          style={[
            styles.midText2,
            {flex: 0, width: wp(16), marginLeft: wp(2)},
          ]}>
          {course}
        </Text>
        <Text style={[styles.midText2, {flex: 0, width: wp(14)}]}>
          {classes}
        </Text>
        <Text style={[styles.midText2]}>{present}</Text>
        <Text style={styles.subTitle2}>{absent}</Text>
        <Text style={styles.subTitle2}>{facultyOff}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AttendanceComponent;

const styles = StyleSheet.create({
  container: {},
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serialText: {
    width: wp(5),
    // flex: 1,
    color: '#333',
    fontSize: wp(3.2),
    // borderWidth: 1,
    textAlign: 'center',
    // marginLeft: wp(3),
  },
  midText2: {
    flex: 1,
    // flex: 2,
    color: '#333',
    fontSize: wp(3.2),
    textAlign: 'center',
    // borderWidth: 1,
    // marginLeft: wp(2),
  },
  subTitle2: {
    flex: 1,
    // flex: 1.2,
    color: '#333',
    fontSize: wp(3.2),
    textAlign: 'center',
    // borderWidth: 1,
    // textAlign: 'right',
  },
});
