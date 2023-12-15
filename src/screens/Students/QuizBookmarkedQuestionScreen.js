import React, {Component} from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import SafeAreaView from 'react-native-safe-area-view';

// Components
import showToast from '../../components/CustomToast';
import CustomLoader from '../../components/CustomLoader';
import HeaderComponent from '../../components/HeaderComponent';
import ProcessingLoader from '../../components/ProcessingLoader';

// Styles
import interviewQuestionStyles from '../../styles/screens/InterviewQuestionStyles';

// Icons
import prev from '../../assets/icons/left-arrow.png';
import next from '../../assets/icons/right-arrow.png';

export default class QuizBookmarkedQuestionScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: null,
      currentQuestionNumber: null,
      bookmarkedQuestionIndex: 0,
      showProcessingLoader: false,
      reloadUI: false,

      // Timer
      timerOn: false,
      timerTime: 0,
    };

    const info = this.props.navigation.getParam('info', null);

    if (info) {
      const {
        questions,
        bookmarkedQuestionNumbers,
        timerTime,
        resumeTimerCallback,
      } = info;

      this.bookmarkedQuestionNumbers = Array.from(bookmarkedQuestionNumbers);
      this.bookmarkedQuestionNumbers.sort((e1, e2) => {
        if (e1 < e2) {
          return -1;
        } else if (e1 > e2) {
          return 1;
        }

        return 0;
      });

      this.state.timerTime = timerTime - 1000;
      this.state.questions = questions;
      this.state.currentQuestionNumber = this.bookmarkedQuestionNumbers[0];
      this.unansweredBookmarkedQuestionNumbers = [
        ...this.bookmarkedQuestionNumbers,
      ];
      this.resumeTimerCallback = resumeTimerCallback;
    }
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.timer);

    if (this.state.timerOn && this.resumeTimerCallback) {
      this.resumeTimerCallback(this.state.timerTime);
    }
  }

  handleRadioPress = value => {
    if (this.state.timerOn) {
      const {unansweredBookmarkedQuestionNumbers} = this;

      if (unansweredBookmarkedQuestionNumbers) {
        const {questions, currentQuestionNumber, reloadUI} = this.state;
        const index = currentQuestionNumber - 1;
        questions[index].selectedOption = value;

        const indexOfElementToDelete = unansweredBookmarkedQuestionNumbers.indexOf(
          currentQuestionNumber,
        );
        if (indexOfElementToDelete > -1) {
          unansweredBookmarkedQuestionNumbers.splice(indexOfElementToDelete, 1);
        }

        this.setState({reloadUI: !reloadUI});
      }
    } else {
      Alert.alert('', 'Exam Over', [{text: 'OK'}], {
        cancelable: false,
      });
    }
  };

  handlePreviousQuestion = () => {
    const {bookmarkedQuestionNumbers} = this;

    if (bookmarkedQuestionNumbers) {
      const {bookmarkedQuestionIndex} = this.state;

      if (bookmarkedQuestionIndex > 0) {
        const newIndex = bookmarkedQuestionIndex - 1;

        this.setState({
          bookmarkedQuestionIndex: newIndex,
          currentQuestionNumber: bookmarkedQuestionNumbers[newIndex],
        });
      } else {
        showToast('This is first question');
      }
    }
  };

  handleNextQuestion = () => {
    const {bookmarkedQuestionNumbers} = this;

    if (bookmarkedQuestionNumbers) {
      const {bookmarkedQuestionIndex} = this.state;

      if (bookmarkedQuestionIndex < bookmarkedQuestionNumbers.length - 1) {
        const newIndex = bookmarkedQuestionIndex + 1;

        this.setState({
          bookmarkedQuestionIndex: newIndex,
          currentQuestionNumber: bookmarkedQuestionNumbers[newIndex],
        });
      } else {
        showToast('This is last question');
      }
    }
  };

  handleFinishInterview = () => {
    // clearing interval
    clearInterval(this.timer);

    // starting loader and resetting timer
    this.setState({showProcessingLoader: true, timerTime: 0, timerOn: false});

    // calculating result
    const {questions} = this.state;
    let correctAnswers = 0;

    questions.forEach(element => {
      const {ans, selectedOption} = element;

      if (selectedOption) {
        if (ans === selectedOption.toString()) {
          correctAnswers++;
        }
      }
    });

    // stopping loader
    this.setState({showProcessingLoader: false});

    // navigating to result screen
    const info = {correctAnswers, totalQuestions: questions.length};
    this.props.navigation.push('QuizThankYou', {info});
  };

  handleUnansweredBookmarks = () => {
    const {
      unansweredBookmarkedQuestionNumbers,
      state,
      resumeTimer: resumeTimerCallback,
    } = this;

    const {questions, timerTime} = state;

    const info = {
      questions,
      unansweredBookmarkedQuestionNumbers,
      timerTime,
      resumeTimerCallback,
    };

    clearInterval(this.timer);
    this.props.navigation.push('QuizUnansweredBookmarks', {info});
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

    const {
      bookmarkedQuestionNumbers,
      unansweredBookmarkedQuestionNumbers,
      state,
    } = this;
    const {
      questions,
      currentQuestionNumber,
      showProcessingLoader,
      bookmarkedQuestionIndex,
    } = state;
    const question = questions[currentQuestionNumber - 1];
    const totalQuestions = bookmarkedQuestionNumbers.length;
    const isLastQuestion = totalQuestions === bookmarkedQuestionIndex + 1;

    const options = [];
    for (let i = 1; i <= 4; i++) {
      options.push({label: question['op' + i], value: i});
    }

    const selectedOption = question.selectedOption
      ? parseInt(question.selectedOption, 10) - 1
      : -1;

    // formatting timer
    const {timerTime} = this.state;
    const seconds = ('0' + (Math.floor((timerTime / 1000) % 60) % 60)).slice(
      -2,
    );
    const minutes = ('0' + Math.floor((timerTime / 60000) % 60)).slice(-2);
    const hours = ('0' + Math.floor((timerTime / 3600000) % 60)).slice(-2);

    return (
      <SafeAreaView style={interviewQuestionStyles.container}>
        <HeaderComponent
          title="Bookmarked Questions"
          navAction="back"
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
                {bookmarkedQuestionIndex + 1} / {totalQuestions}
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

          {isLastQuestion && unansweredBookmarkedQuestionNumbers.length > 0 && (
            <View style={interviewQuestionStyles.radioFinishView}>
              <TouchableOpacity
                style={interviewQuestionStyles.showBookmarkButton}
                onPress={this.handleUnansweredBookmarks}>
                <Text style={interviewQuestionStyles.radioFinishText}>
                  Unchecked Bookmarks(
                  {unansweredBookmarkedQuestionNumbers.length})
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

        {showProcessingLoader && <ProcessingLoader />}
      </SafeAreaView>
    );
  }
}
