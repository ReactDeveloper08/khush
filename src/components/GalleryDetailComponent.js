import React from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import ImageModal from 'react-native-image-modal';

const GalleryDetailComponent = props => {
  return (
    <View style={homeTileStyles.mainContainer}>
      <View style={{borderWidth: 1, borderRadius: wp(2), borderColor: '#ccc'}}>
        <ImageModal
          resizeMode="contain"
          style={homeTileStyles.tileIcon}
          source={{
            uri: props.item.albumImage,
          }}
        />
      </View>

      <Text style={homeTileStyles.titleStyle}>{props.item.description}</Text>
    </View>
  );
};

export default GalleryDetailComponent;

const homeTileStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tileIcon: {
    width: wp(95),
    aspectRatio: 1.78 / 1,
    borderRadius: wp(2),
  },

  titleStyle: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    bottom: wp(-0.2),
    color: '#fff',
    fontSize: wp(3.5),
    width: wp(95.5),
    paddingVertical: wp(2),
    paddingHorizontal: wp(2.5),
    borderBottomLeftRadius: wp(2),
    borderBottomRightRadius: wp(2),
  },
});
