import React, {Component} from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import CheckBox from 'react-native-check-box';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import showToast from '../../components/CustomToast';
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import ProcessingLoader from '../../components/ProcessingLoader';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import offline from '../../assets/icons/internetConnectionState.gif';
// network alert
import NetInfo from '@react-native-community/netinfo';
// Styles
import interviewQuestionStyles from '../../styles/screens/InterviewQuestionStyles';

// Icons
import prev from '../../assets/icons/left-arrow.png';
import next from '../../assets/icons/right-arrow.png';

// API
import {makeRequest, BASE_URL} from '../../api/ApiInfo';
import {KEYS, getData} from '../../api/UserPreference';

export default class QuizQuestionScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      questions: null,
      ques_id: null,
      currentQuestionNumber: 1,
      showProcessingLoader: false,
      reloadCheckbox: false,
      connectionState: true,
      // Timer
      timerOn: false,
      timerTime: 1800000,
    };

    this.bookmarkedQuestionNumbers = new Set();

    // fetching navigation props
    this.courseName = this.props.navigation.getParam('courseName', null);
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({connectionState: state.isConnected});
    });
    this.fetchQuestion();
  }

  componentWillUnmount() {
    this.unsubscribe();
    clearInterval(this.timer);
  }

  fetchQuestion = async () => {
    try {
      // fetching navigation props
      const courseId = this.props.navigation.getParam('courseId', null);

      if (courseId) {
        // preparing params
        const params = {
          courseId: courseId,
        };

        // calling api
        const response = await makeRequest(
          BASE_URL + 'fetchQuizQuestion',
          params,
        );
        // processing response
        if (response) {
          const {success} = response;

          if (success) {
            const {output: questions} = response;
            console.log('^^^^', questions);
            this.setState({questions, isLoading: false}, () => {
              this.startTimer();
            });
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  handleRadioPress = value => {
    if (this.state.timerOn) {
      const {questions, currentQuestionNumber} = this.state;
      questions[currentQuestionNumber - 1].selectedOption = value;
      console.log('====================================');
      console.log('%%^^%%', value, questions);
      console.log('====================================');
    } else {
      Alert.alert('', 'Exam Over', [{text: 'OK'}], {
        cancelable: false,
      });
    }
  };

  handleQuestionBookmark = () => {
    if (this.state.timerOn) {
      const {questions, currentQuestionNumber, reloadCheckbox} = this.state;
      const index = currentQuestionNumber - 1;

      const {isBookmarked} = questions[index];
      questions[index].isBookmarked = !isBookmarked;

      if (questions[index].isBookmarked) {
        this.bookmarkedQuestionNumbers.add(currentQuestionNumber);
      } else {
        this.bookmarkedQuestionNumbers.delete(currentQuestionNumber);
      }

      this.setState({reloadCheckbox: !reloadCheckbox});
    } else {
      Alert.alert('', 'Exam Over', [{text: 'OK'}], {
        cancelable: false,
      });
    }
  };

  handlePreviousQuestion = () => {
    const {currentQuestionNumber} = this.state;
    if (currentQuestionNumber > 1) {
      this.setState({currentQuestionNumber: currentQuestionNumber - 1});
    } else {
      showToast('This is first question');
    }
  };

  handleNextQuestion = () => {
    const {questions, currentQuestionNumber} = this.state;
    if (currentQuestionNumber < questions.length) {
      this.setState({currentQuestionNumber: currentQuestionNumber + 1});
    } else {
      showToast('This is last question');
    }
  };

  handleFinishInterview = async value => {
    try {
      // Clearing interval
      clearInterval(this.timer);

      // Starting loader and resetting timer
      this.setState({showProcessingLoader: true, timerTime: 0, timerOn: false});

      // Calculating result
      const {questions} = this.state;
      let correctAnswers = 0;
      const quizData = [];

      // return false;
      questions.forEach(element => {
        const {ans, selectedOption} = element;

        if (selectedOption) {
          if (ans === selectedOption.toString()) {
            correctAnswers++;
          }
          quizData.push({
            question_id: element.ques_id,
            choose_opt: selectedOption,
          });
        }
      });

      // Stopping loader
      this.setState({showProcessingLoader: false});
      const userInfo = await getData(KEYS.USER_INFO);
      const {courseName} = this;
      const {s_id} = userInfo;

      this.setState({isLoading: true});
      const info2 = {correctAnswers, totalQuestions: questions.length};

      // Sending quiz data to the server
      const params = {
        student_id: s_id,
        course_name: courseName,
        total_correct: correctAnswers,
        total_marks: info2.totalQuestions,
        quiz_data: JSON.stringify(quizData), // Convert quizData to a JSON string
      };

      const formData = new FormData();
      for (const key in params) {
        formData.append(key, params[key]);
      }
      // Make the API request with quiz data
      const response = await makeRequest(
        BASE_URL + 'finishQuizV2',
        params,
        true,
      );
      // const response = await makeRequest(
      //   BASE_URL + 'finishQuiz',
      //   params,
      //   true,
      // );
      // Check if response has a message and show it to the user
      if (response && response.message) {
        alert(response.message);
        console.log('Response Message:', response.message);

        const info = {correctAnswers, totalQuestions: questions.length};
        // console.log('Quiz Result:', info);
        this.props.navigation.push('QuizThankYou', {info});
      } else {
        this.setState({isLoading: false});
        alert('something went wrong');
        console.log('Invalid API response format.');
        // Handle invalid API response format
      }
      // Navigating to result screen

      // Getting user info
    } catch (error) {
      console.error('Error occurred:', error);
      // Handle the error here, show an error message to the user, etc.
    }
  };

  handleShowBookmarked = () => {
    const {
      bookmarkedQuestionNumbers,
      state,
      resumeTimer: resumeTimerCallback,
    } = this;

    const {questions, timerTime} = state;

    const info = {
      questions,
      bookmarkedQuestionNumbers,
      timerTime,
      resumeTimerCallback,
    };

    clearInterval(this.timer);
    this.props.navigation.push('QuizBookmarkedQuestion', {info});
  };

  startTimer = () => {
    this.setState({timerOn: true});

    this.timer = setInterval(() => {
      const newTime = this.state.timerTime - 1000;

      if (newTime >= 0) {
        this.setState({timerTime: newTime});
      } else {
        this.handleFinishInterview();
      }
    }, 1000);
  };

  resumeTimer = remainingTime => {
    const resumeTime = remainingTime - 1000;
    this.setState({timerTime: resumeTime});
    this.startTimer();
  };

  render() {
    const {isLoading} = this.state;
    if (isLoading) {
      return <CustomLoader />;
    }

    const {courseName, bookmarkedQuestionNumbers, state} = this;
    const {questions, currentQuestionNumber, showProcessingLoader} = state;
    const question = questions[currentQuestionNumber - 1];
    const totalQuestions = questions.length;
    const isLastQuestion = totalQuestions === currentQuestionNumber;

    const options = [];
    for (let i = 1; i <= 4; i++) {
      options.push({label: question['op' + i], value: i});
    }

    const selectedOption = question.selectedOption
      ? parseInt(question.selectedOption, 10) - 1
      : -1;

    const {isBookmarked} = question;

    // formatting timer
    const {timerTime} = this.state;
    const seconds = ('0' + (Math.floor((timerTime / 1000) % 60) % 60)).slice(
      -2,
    );
    const minutes = ('0' + Math.floor((timerTime / 60000) % 60)).slice(-2);
    const hours = ('0' + Math.floor((timerTime / 3600000) % 60)).slice(-2);

    return (
      <SafeAreaView style={interviewQuestionStyles.container}>
        {this.state.connectionState && (
          <>
            <HeaderComponent
              title={courseName}
              // navAction="back"
              nav={this.props.navigation}
            />

            <View style={interviewQuestionStyles.timerContainer}>
              <Text style={interviewQuestionStyles.timer}>
                {hours} : {minutes} : {seconds}
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={interviewQuestionStyles.scrollContainer}>
              <View style={interviewQuestionStyles.questionContainer}>
                <Text style={interviewQuestionStyles.radioQuestionText}>
                  Q{currentQuestionNumber}. {question.ques}
                </Text>

                <View style={interviewQuestionStyles.SquareRadio}>
                  <RadioForm
                    initial={selectedOption}
                    radio_props={options}
                    onPress={this.handleRadioPress}
                    key={currentQuestionNumber}
                  />
                </View>

                <CheckBox
                  rightText="Bookmark this question"
                  isChecked={isBookmarked}
                  onClick={this.handleQuestionBookmark}
                  checkBoxColor="brown"
                  style={interviewQuestionStyles.bookmarkCheckbox}
                  rightTextStyle={
                    interviewQuestionStyles.bookmarkCheckboxRightText
                  }
                />

                <View style={interviewQuestionStyles.radioIconView}>
                  <TouchableOpacity
                    onPress={this.handlePreviousQuestion}
                    style={interviewQuestionStyles.nextPreviousButton}>
                    <Image
                      source={prev}
                      resizeMode="cover"
                      style={interviewQuestionStyles.RadioImg}
                    />
                  </TouchableOpacity>

                  <Text style={interviewQuestionStyles.currentQuestionStatus}>
                    {currentQuestionNumber} / {totalQuestions}
                  </Text>

                  <TouchableOpacity
                    onPress={this.handleNextQuestion}
                    style={interviewQuestionStyles.nextPreviousButton}>
                    <Image
                      source={next}
                      resizeMode="cover"
                      style={interviewQuestionStyles.RadioImg}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {isLastQuestion && bookmarkedQuestionNumbers.size > 0 && (
                <View style={interviewQuestionStyles.radioFinishView}>
                  <TouchableOpacity
                    style={interviewQuestionStyles.showBookmarkButton}
                    onPress={this.handleShowBookmarked}>
                    <Text style={interviewQuestionStyles.radioFinishText}>
                      Show Bookmarked({bookmarkedQuestionNumbers.size})
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {isLastQuestion && (
                <View style={interviewQuestionStyles.radioFinishView}>
                  <TouchableOpacity
                    style={interviewQuestionStyles.radioFinishButton}
                    onPress={this.handleFinishInterview}>
                    <Text style={interviewQuestionStyles.radioFinishText}>
                      Finish
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </>
        )}
        {this.state.connectionState === false && (
          <View style={styles.offlineStyle}>
            <Image source={offline} style={styles.networkIssue} />
          </View>
        )}
        {showProcessingLoader && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  networkIssue: {
    height: hp(50),
    aspectRatio: 1 / 1,
  },
  offlineStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
