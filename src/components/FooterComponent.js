import React from 'react';
import {View, Text, TouchableHighlight, Image, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Icons
import ic_courses from '../assets/icons/ic_courses.png';
import ic_video from '../assets/icons/ic_video.png';
import ic_quiz from '../assets/icons/ic_quiz.png';
import ic_job_fiend from '../assets/icons/ic_job_fiend.png';

const FooterComponent = props => {
  const {tab, nav} = props;

  const handleCourses = () => {
    nav.navigate('Courses');
  };

  const handleFreeVideos = () => {
    nav.navigate('Free Videos');
  };

  const handleQuiz = () => {
    nav.navigate('Quiz');
  };

  const handleFindJob = () => {
    nav.navigate('Find Job');
  };

  const selectedTabStyle = [styles.footerMenu, {backgroundColor: '#dee9f2'}];

  return (
    <View style={styles.footerContainer}>
      <TouchableHighlight
        underlayColor="transparent"
        onPress={handleCourses}
        style={tab === 'Courses' ? selectedTabStyle : styles.footerMenu}>
        <View style={styles.singleMenu}>
          <Image source={ic_courses} style={styles.footerNavigatorIcon} />
          <Text style={styles.footerMenuText}>Courses</Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        underlayColor="transparent"
        onPress={handleFreeVideos}
        style={tab === 'Free Videos' ? selectedTabStyle : styles.footerMenu}>
        <View style={styles.singleMenu}>
          <Image source={ic_video} style={styles.footerNavigatorIcon} />
          <Text style={styles.footerMenuText}>Free Videos</Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        underlayColor="transparent"
        onPress={handleQuiz}
        style={tab === 'Quiz' ? selectedTabStyle : styles.footerMenu}>
        <View style={styles.singleMenu}>
          <Image source={ic_quiz} style={styles.footerNavigatorIcon} />
          <Text style={styles.footerMenuText}>Quiz</Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        underlayColor="transparent"
        onPress={handleFindJob}
        style={tab === 'Find Job' ? selectedTabStyle : styles.footerMenu}>
        <View style={styles.singleMenu}>
          <Image source={ic_job_fiend} style={styles.footerNavigatorIcon} />
          <Text style={styles.footerMenuText}>Find Job</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default FooterComponent;

const styles = StyleSheet.create({
  footerContainer: {
    height: hp(8),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f2f1f1',
  },
  footerMenu: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleMenu: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerNavigatorIcon: {
    height: wp(5),
    aspectRatio: 1 / 1,
  },
  footerMenuText: {
    fontSize: wp(3),
  },
});
