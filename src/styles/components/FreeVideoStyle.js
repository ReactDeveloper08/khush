const React = require('react-native');

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const {StyleSheet} = React;

export default {
  videoTab: {
    backgroundColor: 'white',
    borderRadius: 2,
    height: hp(6),
    padding: wp(2),
    justifyContent: 'center',
  },
  tabText: {
    fontWeight: '500',
    fontSize: wp(4),
    color: 'black',
  },
};
