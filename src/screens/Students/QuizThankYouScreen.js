import React, {useEffect} from 'react';
import {Text, Image, TouchableOpacity} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

// Icons
import emoji_success from '../../assets/images/emoji_success.png';
import emoji_fail from '../../assets/images/emoji_fail.png';

// Styles
import interviewThankyouStyles from '../../styles/screens/InterviewThankyouStyles';

const QuizThankYouScreen = props => {
  const {navigation} = props;

  const handleHome = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    return () => {
      navigation.navigate('Home');
    };
  }, [navigation]);

  const info = navigation.getParam('info', null);

  if (info) {
    const {correctAnswers, totalQuestions} = info;
    const isExamPassed = correctAnswers > parseInt(totalQuestions / 2, 10);
    const resultEmoji = isExamPassed ? emoji_success : emoji_fail;

    return (
      <SafeAreaView style={interviewThankyouStyles.containerClassView}>
        <Image
          source={resultEmoji}
          resizeMode="cover"
          style={interviewThankyouStyles.headerBanner}
        />

        <Text style={interviewThankyouStyles.thanksForExam}>
          Score: {correctAnswers} / {totalQuestions}
        </Text>

        <Text style={interviewThankyouStyles.examWish}>
          Success is not Final, Failure is not Fatal
        </Text>

        <TouchableOpacity
          onPress={handleHome}
          style={interviewThankyouStyles.backToAppButton}>
          <Text style={interviewThankyouStyles.backToAppButtonText}>
            Back To Home
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return null;
};

export default QuizThankYouScreen;
