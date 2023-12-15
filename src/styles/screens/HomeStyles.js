import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const homeStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  sliderContainer: {
    width: wp(100),
    // aspectRatio: 2 / 1,
    height: hp(18),
  },
  contentContainer: {
    flex: 1,
    padding: wp(0.8),
    marginVertical: hp(1.3),
  },
  tileContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  blogContainer: {
    flex: 1,
    margin: wp(1.6),
  },
  blog: {
    flex: 1,
    marginTop: hp(1),
  },
  blogImage: {
    width: '100%',
    height: hp(30),
  },
});

export default homeStyle;
