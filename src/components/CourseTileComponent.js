import React from 'react';
import {View, Text, Image, TouchableHighlight, Alert} from 'react-native';

// Styles
import interviewCourseStyles from '../styles/screens/InterviewCourseStyles';

// User Preference
import {KEYS, getData} from '../api/UserPreference';

const CourseTileComponent = props => {
  const {item, nav} = props;
  const {image, course_name: courseName, course_id: courseId, is_exist} = item;

  const handleInterview = async () => {
    try {
      // fetching userInfo
      const userInfo = await getData(KEYS.USER_INFO);

      if (!userInfo) {
        nav.navigate('Enquire');
        return;
      } else {
        // Assuming userInfo has a property called is_exist
        // if (is_exist === 'Y') {
        //   // Show an alert if is_exist is 'Y'
        //   alert(
        //     'Thanks for participating! Youve already taken the quiz today. Come back tomorrow for a new challenge.',
        //   );
        //   return;
        // }
        // Navigate to QuizQuestion screen if is_exist is not 'Y'
        nav.push('MarksReport', {courseId, courseName, is_exist});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = () => {
    nav.navigate('Enquiry');
  };

  return (
    <TouchableHighlight underlayColor="transparent" onPress={handleInterview}>
      <View style={interviewCourseStyles.courseTile}>
        <Image
          source={{uri: image}}
          resizeMode="cover"
          style={interviewCourseStyles.courseImage}
        />
        <Text style={interviewCourseStyles.courseTitle}>{courseName}</Text>
      </View>
    </TouchableHighlight>
  );
};

export default CourseTileComponent;
