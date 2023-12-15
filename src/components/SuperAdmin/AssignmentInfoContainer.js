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

const AssignmentInfoContainer = props => {
  const {item} = props;
  const {id, givenOn, submittedOn, faculty, grades} = item;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.mainContainer,
          // basicStyles.paddingHalfHorizontal,
          basicStyles.justifyBetween,
        ]}>
        <Text style={styles.serialText}>{id}</Text>
        <Text style={styles.midText2}>{givenOn}</Text>
        <Text style={styles.midText2}>{submittedOn}</Text>
        <Text style={[styles.midText2]}>{faculty}</Text>
        <Text style={styles.subTitle2}>{grades}</Text>
      </View>
    </View>
  );
};

export default AssignmentInfoContainer;

const styles = StyleSheet.create({
  container: {},
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serialText: {
    // flex: 1,
    width: wp(8),
    color: '#333',
    fontSize: wp(3.2),
    // borderWidth: 1,
    textAlign: 'center',
    marginLeft: wp(1),
  },
  midText2: {
    flex: 1,
    // flex: 2,
    color: '#333',
    fontSize: wp(3.2),
    textAlign: 'center',
    // marginLeft: wp(2),
  },
  subTitle2: {
    flex: 0.8,
    // flex: 1.2,
    color: '#333',
    fontSize: wp(3.2),
    textAlign: 'center',
    // textAlign: 'right',
  },
});
