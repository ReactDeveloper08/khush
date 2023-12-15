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

const FeePlanComponent = props => {
  const {item} = props;
  const {courseName, totalFees, discount, feesToBePaid, feesPaid, balance} =
    item;

  return (
    <View style={[styles.container]}>
      <View style={[styles.rowStyle]}>
        <Text style={styles.nameStyle}>{courseName} </Text>
      </View>

      <View style={[styles.contentContainer, {marginVertical: wp(2)}]}>
        <View
          style={[
            basicStyles.alignCenter,
            {borderWidth: 0.7, flex: 1, borderColor: '#888'},
          ]}>
          <Text style={[styles.headText, {marginLeft: wp(0)}]}>Fees</Text>
          <Text style={styles.subTitle}>{totalFees}</Text>
        </View>

        <View
          style={[
            basicStyles.alignCenter,
            {borderWidth: 0.7, flex: 1, borderColor: '#888'},
          ]}>
          <Text style={[styles.headText, {marginLeft: wp(0)}]}>Discount</Text>
          <Text style={styles.subTitle}>{discount}</Text>
        </View>

        <View
          style={[
            basicStyles.alignCenter,
            {borderWidth: 0.7, flex: 1, borderColor: '#888'},
          ]}>
          <Text style={[styles.headText, {marginLeft: wp(0)}]}>Fee Paid</Text>
          <Text style={styles.subTitle}>{feesPaid}</Text>
        </View>

        <View
          style={[
            basicStyles.alignCenter,
            {borderWidth: 0.7, flex: 1, borderColor: '#888'},
          ]}>
          <Text style={[styles.headText, {marginLeft: wp(0)}]}>Balance</Text>
          <Text style={styles.subTitle}>{balance}</Text>
        </View>
      </View>
    </View>
  );
};

export default FeePlanComponent;

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
    // marginLeft: wp(2),
    textTransform: 'capitalize',
  },
  subTitle: {
    // flex: 2,
    color: '#666',
    fontSize: wp(2.8),
    textAlign: 'right',
    textTransform: 'capitalize',
  },
});
