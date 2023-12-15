import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const interviewCourseStyles = StyleSheet.create({
  courseTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 2,
    padding: wp(2),
  },
  courseImage: {
    height: hp(5),
    aspectRatio: 1 / 1,
  },
  courseTitle: {
    color: '#000',
    fontSize: wp(3.2),
    marginLeft: wp(4),
  },
});

export default interviewCourseStyles;
