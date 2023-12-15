import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const interviewThankyouStyles = StyleSheet.create({
  containerClassView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  headerBanner: {
    height: hp(20),
    aspectRatio: 1 / 1,
    marginBottom: wp(5),
  },
  examWish: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#026440',
    textAlign: 'center',
  },
  thanksForExam: {
    fontWeight: 'bold',
    fontSize: wp(5),
    marginBottom: hp(1),
  },
  backToAppButton: {
    height: hp(6),
    backgroundColor: '#1d99d2',
    borderRadius: 2,
    marginTop: hp(5),
    paddingHorizontal: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToAppButtonText: {
    color: '#fff',
    fontSize: wp(4),
    textAlign: 'center',
  },
});

export default interviewThankyouStyles;
