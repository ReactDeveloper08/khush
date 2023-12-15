import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const AttendanceComp = props => {
  const {date, batch, status, isPresent, facultyAbsent} = props.item;

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <View
          style={{
            width: wp(2.5),
            height: wp(2.5),
            borderRadius: wp(5),
            backgroundColor:
              facultyAbsent === 'true'
                ? 'yellow'
                : isPresent === 'false'
                ? 'red'
                : 'green',
            marginRight: wp(1),
            marginTop: wp(0.5),
          }}></View>

        <View style={styles.dataContainer}>
          <View style={styles.dataLeftAligned}>
            <Text style={styles.infoHeadTextStyle}>{date}</Text>
          </View>
          <View style={styles.centerAlignedContainer}>
            {/* <Text style={styles.infoHeadStyle}>BatchCode</Text> */}
            <Text style={styles.infoHeadTextStyle}>{batch}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.statusRightAligned}>
            {/* <Text style={styles.infoHeadStyle}>Status</Text> */}
            <Text style={styles.infoHeadTextStyle}>{status}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: wp(2),
    backgroundColor: '#ddd8',
    borderRadius: wp(1.2),
    marginHorizontal: wp(1.5),
    marginBottom: wp(-2),
    marginTop: wp(2),
    padding: wp(-2),
  },
  listContainer: {
    padding: wp(3),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    // marginBottom: wp(2),
  },
  infoHeadTextStyle: {
    color: '#333',
    fontSize: wp(2.5),
    fontWeight: 'bold',
  },
  infoHeadStyle: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: wp(3),
    textTransform: 'capitalize',
  },
  dataContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dataLeftAligned: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerAlignedContainer: {
    flex: 1,
    alignItems: 'center',
  },
  statusContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusRightAligned: {
    alignItems: 'flex-end',
  },
});

export default AttendanceComp;
