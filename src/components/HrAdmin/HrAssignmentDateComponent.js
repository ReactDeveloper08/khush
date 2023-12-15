/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, TouchableHighlight, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const HrAssignmentDateComponent = props => {
  const {item, backgroundColor, index} = props;
  const {
    assignmentId,
    batchCode,
    branchId,
    batchId,
    branchName,
    isUpdated,
    isGiven,
    faculty,
    givenOn,
  } = item;

  const handleViewAssignment = () => {
    if (isGiven) {
      props.nav.push('HrAssignmentDetail', {
        assignmentInfo: item,
      });
    }
  };

  return (
    <TouchableHighlight
      underlayColor="transparent"
      style={[
        styles.container,
        {
          backgroundColor: isGiven
            ? isUpdated
              ? '#9998'
              : '#1d99d2'
            : '#a50000',
        },
      ]}
      onPress={handleViewAssignment}>
      <View style={styles.mainContainer}>
        <Text
          style={[
            {
              color: isGiven ? (isUpdated ? '#111' : '#fff') : '#fff',
              paddingLeft: wp(2),
              fontSize: wp(3),
            },
          ]}>
          {index}
        </Text>

        <View style={styles.contentContainer}>
          <View style={styles.rowStyle}>
            <Text
              style={[
                {
                  color: isGiven ? (isUpdated ? '#111' : '#fff') : '#fff',
                  flex: 1.5,
                  fontSize: wp(3),
                  textAlign: 'left',
                  textTransform: 'capitalize',
                },
              ]}>
              {batchCode}
            </Text>
            <View style={[styles.fromDateFieldContainer]}>
              <Text
                style={{
                  color: isGiven ? (isUpdated ? '#111' : '#fff') : '#fff',
                  fontSize: wp(3),
                }}>
                {branchName}
              </Text>
            </View>
            <View style={[styles.fromDateFieldContainer2]}>
              <Text
                style={{
                  color: isGiven ? (isUpdated ? '#111' : '#fff') : '#fff',
                  fontSize: wp(3),
                }}>
                {faculty}
              </Text>
            </View>
            <View style={styles.fromDateFieldContainer3}>
              <Text style={{fontSize: wp(3)}}>{givenOn}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default HrAssignmentDateComponent;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#e7e8e9',
    // borderRadius: wp(0.5),
    paddingHorizontal: wp(2),
    // borderWidth: 1,
  },
  checkBoxStyle: {
    height: hp(2),
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: hp(1.2),
    // borderWidth: 1,
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
    marginLeft: wp(5),
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameStyle: {
    flex: 0.5,
    color: '#111',
    fontSize: wp(3.5),
    marginLeft: wp(5),
    // fontWeight: '700',
  },
  statusStyle: {
    // flex: 0.4,
    color: '#111',
    fontSize: wp(3.5),
    textAlign: 'right',
    // borderWidth: 1,
    // fontWeight: '700',
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
    color: '#111',
    fontSize: wp(3),

    textAlign: 'right',
  },
  fromDateFieldContainer: {
    flex: 0.6,
    // height: hp(5),
    // borderWidth: 1,
    // paddingHorizontal: wp(4),
    fontSize: wp(3),
    color: '#333',

    marginVertical: wp(3),
    // justifyContent: 'center',
  },
  fromDateFieldContainer2: {
    fontSize: wp(3),
    // color: '#333',
    width: wp(18),
    marginVertical: wp(3),
  },
  fromDateFieldContainer3: {
    fontSize: wp(3),
    color: '#333',
    width: wp(20),
    marginVertical: wp(3),
  },
  selectedDateStyle: {
    fontSize: wp(3),
  },
});
