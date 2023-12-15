import React, {PureComponent} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default class InterviewBookmarkItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showAnswer: false,
    };
  }

  handleShowAnswer = () => {
    this.setState(prevState => ({showAnswer: !prevState.showAnswer}));
  };

  render() {
    const {item, index} = this.props;
    const {ques, ans} = item;
    const {showAnswer} = this.state;

    const questionNumber = index + 1;
    const correctAnswer = item['op' + ans];

    return (
      <View style={styles.container}>
        <View style={styles.questionContainer}>
          <Text onPress={this.handleShowAnswer} style={styles.question}>
            Q{questionNumber}. {ques}
          </Text>
        </View>

        {showAnswer && (
          <View style={styles.answerContainer}>
            <Text style={styles.answer}>{correctAnswer}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 2,
    padding: wp(2),
  },
  questionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  question: {
    flex: 1,
    color: '#000',
    fontSize: wp(3.4),
  },
  answerContainer: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 2,
    marginTop: hp(2),
    padding: wp(2),
  },
  answer: {
    flex: 1,
    color: '#000',
    fontSize: wp(3.4),
  },
});
