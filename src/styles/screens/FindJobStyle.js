import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const findJobStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 3,
    padding: wp(2),
  },
  viewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewTop2: {
    flex: 1,
  },
  item: {
    color: 'black',
    fontSize: wp(4),
    fontWeight: '700',
    marginBottom: hp(2),
  },
  viewTop2Image: {
    width: wp(3),
    aspectRatio: 1 / 1,
  },
  viewTop3: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  viewTop3Image: {
    height: hp(3),
    aspectRatio: 2 / 1,
  },
  iconView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  iconText: {
    color: '#000',
    fontSize: wp(3.2),
    marginLeft: wp(3),
  },
  button: {
    backgroundColor: '#1d99d2',
    borderRadius: 2,
    paddingHorizontal: wp(3.2),
    paddingVertical: hp(0.8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  button2: {
    backgroundColor: '#90EE90',
    borderRadius: 2,
    paddingHorizontal: wp(3.2),
    paddingVertical: hp(0.8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchText: {
    color: 'white',
    fontSize: wp(3.3),
    textAlign: 'center',
  },
  touchText2: {
    color: '#000',
    fontSize: wp(3.3),
    textAlign: 'center',
  },
  line: {
    height: 1,
    backgroundColor: '#6e6e6e',
  },
  requirementTitle: {
    color: 'black',
    fontSize: wp(3.5),
    fontWeight: '700',
    marginTop: hp(1),
  },
  requirementContainer: {
    flex: 1,
  },
  requirements: {
    color: '#000',
    fontSize: wp(3.2),
  },
});

export default findJobStyles;
