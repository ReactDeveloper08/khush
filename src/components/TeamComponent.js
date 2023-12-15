/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import basicStyles from '../styles/BasicStyles';

//component design
const TeamComponent = props => {
  const createArea = () => {
    return props.item.area.map((item, index) => (
      <Text
        key={index}
        style={{color: '#fff', marginRight: wp(3), fontSize: wp(3.5)}}>
        {item}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.flat}>
        <View style={styles.viewTop}>
          <View
            style={[
              basicStyles.whiteBackgroundColor,
              {borderRadius: wp(2), overflow: 'hidden'},
            ]}>
            <Image source={{uri: props.item.image}} style={styles.teamImage} />
          </View>

          <View style={styles.profileView}>
            <Text style={styles.profileText}>{props.item.name}</Text>
            <Text style={{color: '#fff', fontSize: wp(3.2)}}>
              {props.item.experience} Years Exp.
            </Text>

            <Text style={[styles.profileText, basicStyles.marginTopHalf]}>
              Area of Expertise
            </Text>
            <View
              style={[
                basicStyles.directionRow,
                basicStyles.alignCenter,
                {flexWrap: 'wrap'},
              ]}>
              {createArea()}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TeamComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1778a5',
    borderRadius: wp(2),
  },
  item: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: wp(4),
  },
  flat: {
    borderRadius: wp(4),
    // borderWidth: 0.1,
    paddingVertical: wp(2),
    paddingHorizontal: wp(2),
  },
  viewTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  teamImage: {
    height: hp(15),
    width: wp(26),
  },
  profileView: {
    flex: 1,
    marginLeft: wp(3.5),
    paddingRight: wp(2),
  },
  profileText: {
    fontSize: wp(4),
    fontWeight: 'bold',

    marginBottom: wp(1),
    color: '#fff',
  },
});
