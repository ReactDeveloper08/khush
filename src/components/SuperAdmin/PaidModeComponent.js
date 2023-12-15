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
import basicStyles from '../../styles/BasicStyles';

const PaidModeComponent = props => {
  const {item} = props;

  const {id, courseName, receiptNo, paymentDate, totalAmount} = item;

  return (
    <View style={[styles.container]}>
      <View style={[styles.rowStyle]}>
        <Text style={styles.nameStyle}>{courseName} </Text>
      </View>

      <View style={[styles.contentContainer, {marginTop: wp(2)}]}>
        <View
          style={[
            basicStyles.alignCenter,
            {borderWidth: 0.7, flex: 1, borderColor: '#888'},
          ]}>
          <Text style={[styles.headText, {marginLeft: wp(0)}]}>Amount</Text>
          <Text style={styles.subTitle}>{totalAmount}</Text>
        </View>

        <View
          style={[
            basicStyles.alignCenter,
            {borderWidth: 0.7, flex: 1, borderColor: '#888'},
          ]}>
          <Text style={[styles.headText, {marginLeft: wp(0)}]}>
            Receipt No.
          </Text>
          <Text style={styles.subTitle}>{receiptNo}</Text>
        </View>

        <View
          style={[
            basicStyles.alignCenter,
            {borderWidth: 0.7, flex: 1, borderColor: '#888'},
          ]}>
          <Text style={[styles.headText, {marginLeft: wp(0)}]}>Paid on</Text>
          <Text style={styles.subTitle}>{paymentDate}</Text>
        </View>
      </View>
    </View>
  );
};

export default PaidModeComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: wp(2),
    paddingVertical: wp(2),
    // borderWidth: 1,
    padding: wp(1),
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
    fontSize: wp(3),
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  headText: {
    // flex: 1,
    textAlign: 'left',
    color: '#666',
    fontSize: wp(2.8),
    fontWeight: '700',
    marginLeft: wp(2),
    textTransform: 'capitalize',
  },
  midText: {
    color: '#666',
    fontSize: wp(2.8),
    fontWeight: '700',
    textTransform: 'capitalize',
    // marginLeft: wp(2),
  },
  subTitle: {
    // flex: 2,
    color: '#666',
    fontSize: wp(2.8),
    textAlign: 'right',
    textTransform: 'capitalize',
  },
});
