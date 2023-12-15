import React from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
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

const SCollectionDetailComponent = props => {
  const {item, backgroundColor} = props;
  const {id, date, feeData, total} = item;

  const renderItem = ({item}) => {
    const {name, enrollNo, course, receiptNo, amount} = item;
    const backColor = backgroundColor;
    return (
      <View
        style={[
          {
            backgroundColor: backColor,
            padding: wp(2),
            paddingHorizontal: wp(4),
          },
        ]}>
        <View style={styles.rowStyle}>
          <Text style={styles.nameStyle1}>{name} </Text>
          <Text style={styles.statusText1}>Rec No. - {receiptNo} </Text>
        </View>

        <View style={styles.rowStyle}>
          <Text style={styles.headText}>{course}</Text>
          <Text style={styles.midText}> </Text>
          <Text style={[styles.subTitle]}>Rs. {amount}</Text>
        </View>
      </View>
    );
  };

  const keyExtractor = (item, index) => index.toString();

  const itemSeparator = () => <View style={styles.separator} />;

  return (
    <View style={[styles.container]}>
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.rowStyle,
            {
              backgroundColor: backgroundColor,
              padding: wp(2),
              borderRadius: wp(1),
            },
          ]}>
          <Text style={styles.nameStyle}>Date : </Text>
          <Text style={[basicStyles.text, {color: '#111'}]}>{date}</Text>
          <Text style={styles.statusText}>Total - Rs.{total} </Text>
        </View>

        <View
          style={[
            basicStyles.flexOne,
            basicStyles.paddingHalfVertical,
            {marginHorizontal: wp(-2)},
          ]}>
          <FlatList
            data={feeData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={itemSeparator}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
};

export default SCollectionDetailComponent;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#e7e8e9',
    borderRadius: wp(2),
    // padding: wp(2),
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
  statusText1: {
    textAlign: 'right',
    flex: 1,
    color: '#222',
    fontSize: wp(3.2),
    // fontWeight: '700',
  },
  statusText: {
    textAlign: 'right',
    flex: 1,
    color: '#222',
    fontSize: wp(3.2),
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
  },
  nameStyle1: {
    color: '#111',
    fontSize: wp(3.2),
    // fontWeight: '700',
  },
  headText: {
    flex: 1,
    color: '#222',
    fontSize: wp(3.2),
    // fontWeight: '700',
    // marginLeft: wp(2),
    textTransform: 'capitalize',
  },
  midText: {
    color: '#111',
    fontSize: wp(3),
    // fontWeight: '700',
    marginLeft: wp(2),
    textTransform: 'capitalize',
  },
  subTitle: {
    flex: 2,
    color: '#222',
    fontSize: wp(3),
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  headText2: {
    // flex: 1,
    color: '#111',
    fontSize: wp(3.2),
    // fontWeight: '700',
    marginLeft: wp(2),
  },
  midText2: {
    color: '#111',
    fontSize: wp(3.2),
    fontWeight: '700',
    marginHorizontal: wp(1),
  },
  subTitle2: {
    // flex: 2,
    color: '#111',
    fontSize: wp(3.2),
    textAlign: 'right',
  },
  separator: {
    height: wp(1),
  },
});
