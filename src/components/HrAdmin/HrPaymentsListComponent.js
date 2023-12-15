import React, {useState} from 'react';

import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Images
import ic_delete from '../../assets/icons/ic_delete.png';
import ic_check_white from '../../assets/icons/ic_check_white.png';

import basicStyles from '../../styles/BasicStyles';

const PaymentsListComponent = props => {
  const {item, backgroundColor, handleApprovePayment} = props;

  const {branch, mode, amount, comment, status, date} = item;

  const handleApproval = () => {
    handleApprovePayment(item);
  };

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <View style={styles.notificationHeader}>
        <Text style={styles.title}>
          {branch} ({mode})
        </Text>
        <View style={styles.buttonsContainer}>
          {status === 'P' ? (
            <TouchableOpacity
              style={[styles.buttonStyle, {backgroundColor: 'green'}]}
              onPress={handleApproval}>
              <Image
                source={ic_check_white}
                resizeMode="cover"
                style={basicStyles.iconColumn}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={[basicStyles.directionRow]}>
        <Text style={styles.amountStyles}>Amount : </Text>
        <Text style={[styles.amountStyles, {marginLeft: wp(1)}]}>
          Rs. {amount}
        </Text>
      </View>

      <View style={styles.notificationBody}>
        <Text style={styles.message}>{comment}</Text>
      </View>
      <View style={[basicStyles.directionRow, basicStyles.justifyBetween]}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.date}>
          Status - {status === 'P' ? 'Pending' : 'Approved'}
        </Text>
      </View>
    </View>
  );
};

export default PaymentsListComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 2,
    padding: wp(2),
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(1),
  },
  bellIcon: {
    width: wp(5.4),
    aspectRatio: 1 / 1,
  },
  audioContainer: {
    // position: 'absolute',
    // right: 0,
    marginLeft: wp(1),
  },
  audioIcon: {
    height: hp(4),
    aspectRatio: 1 / 1,
  },
  title: {
    color: '#111',
    fontSize: wp(3.8),
    fontWeight: '700',
    // marginLeft: wp(2),
    flex: 1,
    textTransform: 'capitalize',
  },
  notificationBody: {
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
    paddingBottom: hp(2),
    flexDirection: 'row',
  },
  message: {
    flex: 1,
    color: '#111',
    fontSize: wp(3.2),
    textAlign: 'justify',
    textTransform: 'capitalize',
  },
  date: {
    color: '#666',
    fontSize: wp(2.8),
    marginTop: wp(2),
    fontWeight: '700',
  },
  amountStyles: {
    color: '#333',
    fontSize: wp(3.2),
    marginBottom: wp(1),
    fontWeight: '700',
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
