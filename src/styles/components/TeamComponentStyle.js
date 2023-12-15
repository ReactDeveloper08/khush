import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const teamComponentStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  facultyImage: {
    height: hp(25),
    aspectRatio: 2.5 / 3,
  },
  detailComponent: {
    flex: 1,
    justifyContent: 'center',
    padding: wp(2),
  },
  facultyName: {
    fontSize: wp(4),
    fontWeight: '700',
    color: '#414042',
  },
  facultyExp: {
    marginVertical: hp(0.5),
  },
  expertiseTitle: {
    fontSize: wp(4),
  },
  expertiseValue: {
    paddingLeft: wp(3),
    marginTop: hp(1),
  },
});

export default teamComponentStyles;
