import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const contactStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flat: {
    borderRadius: 3,
    color: '#eef3f9',
    borderBottomColor: 'grey',
    paddingHorizontal: wp(2),
    paddingVertical: hp(2),
    flexDirection: 'row',
  },
  contactInfo: {
    flex: 1,
    paddingRight: wp(2),
  },

  view: {
    marginBottom: wp(2),
  },
  location: {
    fontSize: wp(5),
    fontWeight: '700',
  },
  address: {
    fontSize: wp(3.5),
    color: '#414042',
    fontWeight: 'bold',
  },
  contactNo: {
    fontSize: wp(4),
    color: '#44A4DB',
    fontWeight: 'bold',
  },
  contactButtons: {
    width: wp(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundViewL: {
    width: wp(10),
    height: wp(10),
    backgroundColor: '#44A4DB',
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
  },
  roundViewP: {
    backgroundColor: 'green',
  },
  // nearestBranchIndicatorText: {
  //   position: 'absolute',
  //   bottom: 0,
  //   right: 0,
  //   left: 0,
  //   backgroundColor: 'green',
  //   paddingVertical: hp(2),
  //   color: '#000',
  //   width: wp(20),
  // },
});

export default contactStyle;
