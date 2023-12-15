import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const interviewQuestionStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: wp(2),
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  timer: {
    color: 'green',
    fontSize: wp(4),
    fontWeight: '600',
  },
  questionContainer: {
    flex: 1,
  },
  radioQuestionText: {
    fontSize: wp(4),
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  SquareRadio: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 2,
    padding: wp(1),
    marginBottom: hp(2),
  },
  bookmarkCheckbox: {
    flex: 1,
    padding: wp(1),
  },
  bookmarkCheckboxRightText: {
    color: 'brown',
    fontSize: wp(4),
  },
  radioIconView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp(6),
    marginBottom: hp(4),
  },
  nextPreviousButton: {
    width: wp(10),
    height: wp(10),
    backgroundColor: '#1d99d2',
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  RadioImg: {
    height: hp(2.5),
    aspectRatio: 1 / 1,
  },
  currentQuestionStatus: {
    color: '#000',
    fontSize: wp(4),
    marginHorizontal: wp(10),
  },
  radioFinishView: {
    marginTop: hp(2),
  },
  showBookmarkButton: {
    height: hp(7),
    backgroundColor: 'brown',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioFinishButton: {
    height: hp(7),
    backgroundColor: '#1d99d2',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioFinishText: {
    color: 'white',
    fontSize: wp(4),
  },
});

export default interviewQuestionStyles;
