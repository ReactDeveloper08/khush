import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Icons
import ic_bookmarks from '../assets/icons/ic_bookmarks.png';

// User Preference
import {KEYS, getData} from '../api/UserPreference';

const InterviewTileComponent = props => {
  const {item, nav} = props;
  const {image, course_name: courseName, course_id: courseId} = item;

  const handleInterview = async () => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);

      if (!userInfo) {
        // Alert.alert(
        //   'Alert!',
        //   'You Need to Login First.\nPress LOGIN to Continue!',
        //   [
        //     {text: 'NO', style: 'cancel'},
        //     {text: 'Enquiry', onPress: handleLogin},
        //   ],
        //   {
        //     cancelable: false,
        //   },
        // );
        nav.navigate('Enquiry');
        return;
      } else {
        nav.push('InterviewQuestion', {courseId, courseName});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmarks = async () => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);

      if (!userInfo) {
        // Alert.alert(
        //   'Alert!',
        //   'You Need to Login First.\nPress LOGIN to Continue!',
        //   [
        //     {text: 'NO', style: 'cancel'},
        //     {text: 'Enquiry', onPress: handleLogin},
        //   ],
        //   {
        //     cancelable: false,
        //   },
        // );
        nav.navigate('Enquiry');
        return;
      } else {
        nav.push('InterviewBookmarks', {courseId, courseName});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = () => {
    nav.navigate('Enquiry');
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        underlayColor="transparent"
        onPress={handleInterview}
        style={styles.courseTileContainer}>
        <View style={styles.courseTile}>
          <Image
            source={{uri: image}}
            resizeMode="cover"
            style={styles.courseImage}
          />
          <Text style={styles.courseTitle}>{courseName}</Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight underlayColor="transparent" onPress={handleBookmarks}>
        <Image
          source={ic_bookmarks}
          resizeMode="cover"
          style={styles.bookmark}
        />
      </TouchableHighlight>
    </View>
  );
};

export default InterviewTileComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: wp(2),
  },
  courseTileContainer: {
    flex: 1,
  },
  courseTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseImage: {
    height: hp(5),
    aspectRatio: 1 / 1,
  },
  courseTitle: {
    color: '#000',
    fontSize: wp(3.2),
    marginLeft: wp(4),
  },
  bookmark: {
    height: hp(3),
    aspectRatio: 1 / 1,
  },
});
