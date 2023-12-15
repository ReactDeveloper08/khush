import React from 'react';
import {View, Image, Text, StyleSheet, TouchableHighlight} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SSingleCourseTileComponent = props => {
  const handleCourseDetail = () => {
    props.nav.push('SCourseDetail', {
      info: {
        id: props.item.id,
        image: props.item.image,
        description: props.item.description,
        courseName: props.courseName,
        nameCourse: props.item.cname,
      },
    });
  };

  return (
    <TouchableHighlight
      underlayColor="transparent"
      onPress={handleCourseDetail}
      // style={styles.courseContainer}
    >
      <View style={[styles.courseContainer, {backgroundColor: '#ddd'}]}>
        {/* <Image
          source={{uri: props.item.image}}
          resizeMode="cover"
          style={styles.icon}
        /> */}
        <Text style={styles.formal} numberOfLines={2} ellipsizeMode="clip">
          {props.item.cname}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export default SSingleCourseTileComponent;

const styles = StyleSheet.create({
  courseContainer: {
    width: wp(33.3),
    height: hp(18.2),
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 0.5,
    // borderColor: '#888',
  },
  courseTileContainer: {
    // borderWidth: 0.5,
    alignItems: 'center',
    padding: wp(2),
  },
  icon: {
    width: '100%',
    height: '100%',
    // width: wp(22),
    // aspectRatio: 1 / 1,
  },
  formal: {
    marginTop: hp(1),
    paddingHorizontal: wp(2),
    color: '#333',
    fontSize: wp(3.2),
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    // borderWidth: 0.5,
  },
});
