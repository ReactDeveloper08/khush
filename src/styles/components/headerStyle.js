import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const headerStyle = StyleSheet.create({
  headerContainer: {
    height: hp(10),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backIcon: {},
  headerTitle: {
    color: '#fff',
    fontSize: 16,
  },
});
export default headerStyle;
