import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  loginScreenContainer: {
    flex: 1,
  },
  loginFormView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(3),
  },
  logo: {
    height: wp(20),
    aspectRatio: 3 / 1,
    marginBottom: hp(8),
    alignSelf: 'center',
  },
  loginFormInputContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    // height: hp(4),
    width: wp(85),
    fontSize: wp(3.7),
    marginVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#1d99d2',
    flexDirection: 'row',
  },
  loginFormTextInput: {
    fontSize: wp(3.7),
    marginLeft: wp(2),
    flex: 1,
    marginBottom: wp(2),
  },
  button: {
    height: hp(7),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d99d2',
    marginTop: hp(8),
    width: wp(60),
    alignSelf: 'center',
    borderRadius: wp(2),
  },
  buttonText: {
    color: 'white',
    fontSize: wp(3.7),
  },
  iconsStyle: {
    height: hp(3),
    aspectRatio: 1 / 1,
    marginRight: wp(2),
  },
});

export default styles;
