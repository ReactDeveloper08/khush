import React from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const HomeTileComponent = props => {
  const handleScreen = () => {
    props.nav.navigate('SGalleryDetail', {
      galleryImages: props.item.galleryImages,
    });
  };

  return (
    <TouchableOpacity
      onPress={handleScreen}
      style={homeTileStyles.mainContainer}>
      <View style={{borderWidth: 1, borderRadius: wp(2), borderColor: '#ccc'}}>
        <Image
          source={{uri: props.item.galleryImages[0]}}
          resizeMode="cover"
          style={homeTileStyles.tileIcon}
        />
      </View>

      <Text style={homeTileStyles.titleStyle}>{props.item.galleryTitle}</Text>
    </TouchableOpacity>
  );
};

export default HomeTileComponent;

const homeTileStyles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    paddingBottom: wp(2),
  },

  tileIcon: {
    width: wp(47),
    aspectRatio: 1 / 1,
    // borderRadius: wp(2),
  },
  titleStyle: {
    color: '#000',
    fontSize: wp(3.2),
    fontWeight: '700',
    textAlign: 'center',
    marginTop: wp(0.5),
  },
});
