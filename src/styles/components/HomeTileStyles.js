import {StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const tileStyle = StyleSheet.create({
  tileContent: {
    flex: 1,
    aspectRatio: 1.2 / 1,
    margin: wp(0.8),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Platform.OS === 'ios' ? 0.2 : 0,
    borderColor: '#999',
    borderRadius: wp(2),
  },
  tileIcon: {
    height: hp(5.6),
    aspectRatio: 1 / 1,
  },
  titleStyle: {
    color: '#000',
    fontSize: wp(3.4),
    textAlign: 'center',
  },
});

export default tileStyle;
