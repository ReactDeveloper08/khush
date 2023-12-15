import {StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const teamStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: wp(4),
  },
  flat: {
    backgroundColor: 'white',
    borderRadius: wp(4),
    borderWidth: 0.1,
    paddingTop: wp(3),
    paddingLeft: wp(4),
    paddingRight: wp(4),
  },
  viewTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewTop2: {
    marginBottom: wp(3),
  },
  viewTop2Image: {
    height: hp(3),
    width: wp(5),
  },
  viewTop3Image: {
    height: hp(5),
    width: wp(9),
    alignSelf: 'center',
  },
  iconView: {
    flexDirection: 'row',
    marginBottom: wp(4),
  },
  iconText: {
    marginLeft: wp(3),
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#1d99d2',
    marginTop: wp(4),
    marginRight: wp(5),
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  touchText: {
    color: 'white',
  },
  line: {
    borderWidth: wp(0.1),
  },
  rText: {
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  teamImage: {
    height: hp(20),
    width: wp(35),
  },
  profileView: {
    marginLeft: wp(5),
    marginTop: wp(3),
  },
  profileText: {
    fontSize: wp(4),
    fontWeight: 'bold',
    marginHorizontal: wp(1),
    marginBottom: wp(1),
  },
});

export default teamStyles;
