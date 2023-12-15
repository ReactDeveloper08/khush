import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const headerStyle = StyleSheet.create({
  headerContainer: {
    height: hp(5.5),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    // backgroundColor: '#1d99d2',
    // borderBottomLeftRadius: wp(3),
    // borderBottomRightRadius: wp(3),
  },
  linearGradient: {
    height: hp(5.5),
    width: '100%',
  },
  backIcon: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(1),
  },
  backIcon2: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
    marginHorizontal: wp(1),
  },
  headerTitle: {
    color: '#fff',
    fontSize: wp(4),
    // fontWeight: '700',
  },
});

export default headerStyle;
